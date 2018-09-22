package com.ninja.ninjaccount.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.security.jwt.JWTConfigurer;
import com.ninja.ninjaccount.security.jwt.TokenProvider;
import com.ninja.ninjaccount.security.srp.SRP6ServerWorkflow;
import com.ninja.ninjaccount.service.AccountsDBService;
import com.ninja.ninjaccount.service.SrpService;
import com.ninja.ninjaccount.service.UserService;
import com.ninja.ninjaccount.service.dto.SrpDTO;
import com.ninja.ninjaccount.web.rest.vm.LoginVM;
import com.ninja.ninjaccount.web.rest.vm.SaltAndBVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Optional;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final Logger log = LoggerFactory.getLogger(UserJWTController.class);

    private final TokenProvider tokenProvider;

    private final AuthenticationManager authenticationManager;

    private final AccountsDBService accountsDBService;

    private SrpService srpService;

    private SRP6ServerWorkflow workflow;

    private UserService userService;

    private SecureRandom secureRandom;

    public UserJWTController(TokenProvider tokenProvider, AuthenticationManager authenticationManager,
                             AccountsDBService accountsDBService, SrpService srpService, SRP6ServerWorkflow workflow,
                             UserService userService) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.accountsDBService = accountsDBService;
        this.srpService = srpService;
        this.workflow = workflow;
        this.userService = userService;
        this.secureRandom = new SecureRandom();
    }

    @PostMapping(path = "/preauthenticate")
    @Timed
    public ResponseEntity<SaltAndBVM> preAuthorize(@RequestBody String login) {
        Optional<SrpDTO> srpDTO = srpService.getByUsername(login);
        Optional<User> user = userService.getUserWithAuthoritiesByLogin(login);

        if (user.isPresent() && !srpDTO.isPresent()) {
            srpService.generateSrpForAdmin(user.get());
        }

        if (srpDTO.isPresent()) {
            String b = workflow.step1(login, new BigInteger(srpDTO.get().getVerifier(), 16));

            SaltAndBVM saltAndBVM = new SaltAndBVM();
            saltAndBVM.setSalt(srpDTO.get().getSalt());
            saltAndBVM.setB(b);

            return new ResponseEntity<>(saltAndBVM, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/authenticate")
    @Timed
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {

        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginVM.getUsername(), loginVM.getPassword());

        Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        boolean rememberMe = (loginVM.isRememberMe() == null) ? false : loginVM.isRememberMe();
        String jwt = tokenProvider.createToken(authentication, rememberMe);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}

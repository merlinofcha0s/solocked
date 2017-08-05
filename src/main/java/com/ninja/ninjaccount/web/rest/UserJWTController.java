package com.ninja.ninjaccount.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ninja.ninjaccount.security.jwt.JWTConfigurer;
import com.ninja.ninjaccount.security.jwt.TokenProvider;
import com.ninja.ninjaccount.service.AccountsDBService;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
import com.ninja.ninjaccount.web.rest.vm.LoginVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Collections;

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

    public UserJWTController(TokenProvider tokenProvider, AuthenticationManager authenticationManager, AccountsDBService accountsDBService) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.accountsDBService = accountsDBService;
    }

    @PostMapping("/preauthenticate")
    @Timed
    public ResponseEntity preAuthorize(@RequestBody String login) {
        AccountsDBDTO accountsDBDTO  = accountsDBService.findByUsernameLogin(login);
        if(accountsDBDTO == null){
           return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.add("ninja-iv", accountsDBDTO.getInitializationVector());

        return ResponseEntity.ok().headers(headers).body(accountsDBDTO.getDatabase());
    }

    @PostMapping("/authenticate")
    @Timed
    public ResponseEntity authorize(@Valid @RequestBody LoginVM loginVM, HttpServletResponse response) {

        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginVM.getUsername(), loginVM.getPassword());

        try {
            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            boolean rememberMe = (loginVM.isRememberMe() == null) ? false : loginVM.isRememberMe();
            String jwt = tokenProvider.createToken(authentication, rememberMe);
            response.addHeader(JWTConfigurer.AUTHORIZATION_HEADER, "Bearer " + jwt);
            return ResponseEntity.ok(new JWTToken(jwt));
        } catch (AuthenticationException ae) {
            log.trace("Authentication exception trace: {}", ae);
            return new ResponseEntity<>(Collections.singletonMap("AuthenticationException",
                ae.getLocalizedMessage()), HttpStatus.UNAUTHORIZED);
        }
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

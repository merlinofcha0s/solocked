package com.ninja.ninjaccount.security.srp;

import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.service.SrpService;
import com.ninja.ninjaccount.service.UserService;
import com.ninja.ninjaccount.service.dto.SrpDTO;
import com.ninja.ninjaccount.service.exceptions.SRP6Exception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.lang.String.format;

@Service
public class SrpAuthenticationProvider implements AuthenticationProvider {

    private final Logger log = LoggerFactory.getLogger(SrpAuthenticationProvider.class);
    private SrpService srpService;
    private UserService userService;
    private SRP6ServerWorkflow workflow;

    public SrpAuthenticationProvider(SrpService srpService, @Lazy UserService userService, SRP6ServerWorkflow workflow) {
        this.srpService = srpService;
        this.userService = userService;
        this.workflow = workflow;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String login = authentication.getName();
        String concatOfM1andA = authentication.getCredentials()
            .toString();
        final String[] arrayAandM1 = concatOfM1andA.split(":");

        Optional<SrpDTO> srpDTO = srpService.getByUsername(login);
        Optional<User> userWithAuthoritiesByLogin = userService.getUserWithAuthoritiesByLogin(login);

        if (userWithAuthoritiesByLogin.isPresent() && !userWithAuthoritiesByLogin.get().getActivated()) {
            throw new LockedException(format("User %s is not active", userWithAuthoritiesByLogin.get().getLogin()));
        }

        if (srpDTO.isPresent()) {
            final BigInteger A = new BigInteger(arrayAandM1[0], 16);
            final BigInteger M1 = new BigInteger(arrayAandM1[1], 16);
            final BigInteger verifier = new BigInteger(srpDTO.get().getVerifier(), 16);

            try {
                BigInteger M2 = workflow.step2(A, M1, verifier, login);

                List<GrantedAuthority> grantedAuthorities = userWithAuthoritiesByLogin.get().getAuthorities().stream()
                    .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                    .collect(Collectors.toList());

                Authentication auth = new UsernamePasswordAuthenticationToken(login, M2, grantedAuthorities);
                log.info("user {} authenticated via SRP", login);
                return auth;
            } catch (SRP6Exception e) {
                throw new SessionAuthenticationException(format("Error at step 2 for user %s", userWithAuthoritiesByLogin.get().getLogin()));
            }
        }
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}

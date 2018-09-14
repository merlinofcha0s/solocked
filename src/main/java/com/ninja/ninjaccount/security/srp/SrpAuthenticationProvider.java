package com.ninja.ninjaccount.security.srp;

import com.nimbusds.srp6.SRP6CryptoParams;
import com.nimbusds.srp6.SRP6Exception;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.service.SrpService;
import com.ninja.ninjaccount.service.UserService;
import com.ninja.ninjaccount.service.dto.SrpDTO;
import com.ninja.ninjaccount.web.rest.AccountResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SrpAuthenticationProvider implements AuthenticationProvider {

    private static final BigInteger N = new BigInteger("38684899815547935458433829177914307297432760110779639822858498452946412011897757548250914304423333489183008962252968381421682695374716330071816133323081985240738926427603880060336635851291373929494010257063459917039975484405689456757709349806520905734351505095141838487084175899520705643142171082177965219677604383983143369461886265094505248054317697785771630360145635079171263793030252424812835569962310893391937730029518752977163196323115582874839068974400094884419703433889425575879855274221618170482250225393319010222170386554458323264782323006190892032364196386747096757284049897325986336932135641351740723807465732648196650589934529257274540964535968669739971603110189639612981697345579969831826668048147512833954033715255423065214797917323170126598591443956762528408403404087529415877939744028568195365071574872782662681789936941989481840259761113509953930728651494321104156256283390012977205322576740314634706233298430728334134491778742281237489436226627647515614362304802284971236328150476152580185792039849165241240351546849166882040613012434454644303576664094881825725392910645621598913200017396757915953683447767027251673759891025364304082012530556755352662671480646993595955398280865353374367578076240294116375621");
    private static final BigInteger g = new BigInteger("2");
    private static final String k = "7bd63cfbb8ede64d02a22a4ecb340ea0be3eb01ffeffbc97a8ae9b71d62a81c1343596c3db9dbc117e0f3e19b481f8ef780be099769df21e4aaa004b7b435552";
    private final Logger log = LoggerFactory.getLogger(AccountResource.class);
    private final SRP6CryptoParams config = new SRP6CryptoParams(N, g, "SHA-512");
    private SrpService srpService;
    private UserService userService;
    private SRP6ServerSessionV2 session;

    public SrpAuthenticationProvider(SrpService srpService, @Lazy UserService userService, SRP6ServerSessionV2 session) {
        this.srpService = srpService;
        this.userService = userService;
        this.session = session;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String login = authentication.getName();
        String concatOfM1andA = authentication.getCredentials()
            .toString();
        final String[] arrayAandM1 = concatOfM1andA.split(":");

        Optional<SrpDTO> srpDTO = srpService.getByUsername(login);
        Optional<User> userWithAuthoritiesByLogin = userService.getUserWithAuthoritiesByLogin(login);

        if (srpDTO.isPresent() && userWithAuthoritiesByLogin.isPresent()) {
            final BigInteger A = new BigInteger(arrayAandM1[0], 16);
            final BigInteger M1 = new BigInteger(arrayAandM1[1], 16);
            final BigInteger verifier = new BigInteger(srpDTO.get().getVerifier(), 16);

            try {
                BigInteger M2 = session.step2(A, M1, verifier, login);

                List<GrantedAuthority> grantedAuthorities = userWithAuthoritiesByLogin.get().getAuthorities().stream()
                    .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                    .collect(Collectors.toList());

                Authentication auth = new UsernamePasswordAuthenticationToken(login, M2, grantedAuthorities);
                log.info("user {} authenticated via SRP", login);
                return auth;
            } catch (SRP6Exception e) {
                log.error("Error with step 2", e);
            }
        }
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}

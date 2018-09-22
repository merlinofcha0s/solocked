package com.ninja.ninjaccount.web.rest;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.AccountsDBRepository;
import com.ninja.ninjaccount.repository.UserRepository;
import com.ninja.ninjaccount.security.jwt.TokenProvider;
import com.ninja.ninjaccount.security.srp.SRP6ServerWorkflow;
import com.ninja.ninjaccount.service.AccountsDBService;
import com.ninja.ninjaccount.service.SrpService;
import com.ninja.ninjaccount.service.UserService;
import com.ninja.ninjaccount.service.dto.SrpDTO;
import com.ninja.ninjaccount.web.rest.errors.ExceptionTranslator;
import com.ninja.ninjaccount.web.rest.util.SrpUtils;
import com.ninja.ninjaccount.web.rest.vm.LoginVM;
import com.ninja.ninjaccount.web.rest.vm.LoginVM;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the UserJWTController REST controller.
 *
 * @see UserJWTController
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = NinjaccountApp.class)
public class UserJWTControllerIntTest {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccountsDBService accountsDBService;

    @Autowired
    private AccountsDBRepository accountsDBRepository;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private SRP6ServerWorkflow srp6ServerWorkflow;

    @Autowired
    private SrpService srpService;

    @Autowired
    private UserService userService;

    @Autowired
    private SrpUtils srpUtils;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        UserJWTController userJWTController = new UserJWTController(tokenProvider, authenticationManager,
            accountsDBService, srpService, srp6ServerWorkflow, userService);
        this.mockMvc = MockMvcBuilders.standaloneSetup(userJWTController)
            .setControllerAdvice(exceptionTranslator)
            .build();
    }

    @Test
    @Transactional
    public void testAuthorize() throws Exception {
        User user = new User();
        user.setLogin("user-jwt-controller");
        user.setEmail("user-jwt-controller@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));

        userRepository.saveAndFlush(user);

        SrpDTO srpDTO = srpUtils.generateSRPEntity(user, "test");

        BigInteger a = srpUtils.generatePrivateValue();
        BigInteger A = srpUtils.generateA(a);

        String B = srp6ServerWorkflow.step1(user.getLogin(), new BigInteger(srpDTO.getVerifier(), 16));

        BigInteger x = srp6ServerWorkflow.computeX(srpDTO.getSalt(), user.getLogin(), "test");
        String M1 = srpUtils.generateM1(x, a, new BigInteger(B, 16), A);

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt-controller");
        login.setPassword(A.toString(16) + ":" + M1);
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id_token").isString())
            .andExpect(jsonPath("$.id_token").isNotEmpty())
            .andExpect(header().string("Authorization", not(nullValue())))
            .andExpect(header().string("Authorization", not(isEmptyString())));
    }

    @Test
    @Transactional
    public void testAuthorizeWithRememberMe() throws Exception {
        User user = new User();
        user.setLogin("user-jwt");
        user.setEmail("user-jwt@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));
        userRepository.saveAndFlush(user);

        SrpDTO srpDTO = srpUtils.generateSRPEntity(user, "test");

        BigInteger a = srpUtils.generatePrivateValue();
        BigInteger A = srpUtils.generateA(a);

        String B = srp6ServerWorkflow.step1(user.getLogin(), new BigInteger(srpDTO.getVerifier(), 16));

        BigInteger x = srp6ServerWorkflow.computeX(srpDTO.getSalt(), user.getLogin(), "test");
        String M1 = srpUtils.generateM1(x, a, new BigInteger(B, 16), A);

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt");
        login.setPassword(A.toString(16) + ":" + M1);
        login.setRememberMe(true);
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id_token").isString())
            .andExpect(jsonPath("$.id_token").isNotEmpty())
            .andExpect(header().string("Authorization", not(nullValue())))
            .andExpect(header().string("Authorization", not(isEmptyString())));
    }

    @Test
    @Transactional
    public void testAuthorizeFails() throws Exception {
        LoginVM login = new LoginVM();
        login.setUsername("wrong-user");
        login.setPassword("wrong password");
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.id_token").doesNotExist())
            .andExpect(header().doesNotExist("Authorization"));
    }

    @Test
    @Transactional
    public void testAuthorizeNotActivated() throws Exception {
        User user = new User();
        user.setLogin("user-jwt-not-activated");
        user.setEmail("user-jwt-not-activated@example.com");
        user.setActivated(false);
        user.setPassword(passwordEncoder.encode("test"));
        userRepository.saveAndFlush(user);

        srpUtils.generateSRPEntity(user, "test");

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt-not-activated");
        login.setPassword("test");
        login.setRememberMe(true);
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.id_token").doesNotExist())
            .andExpect(header().doesNotExist("Authorization"));
    }

    @Test
    @Transactional
    public void testPreAuthenticateSucceed() throws Exception {
        User user = new User();
        user.setLogin("user-jwt-controller-remember-me");
        user.setEmail("user-jwt-controller-remember-me@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));

        userRepository.saveAndFlush(user);

        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();
        accountsDBService.createNewAccountDB(bytes, uuid, user);

        srpUtils.generateSRPEntity(user, UUID.randomUUID().toString().replace("-", ""));

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt-controller-remember-me");
        MockHttpServletResponse mockResponse = mockMvc.perform(post("/api/preauthenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content("user-jwt-controller-remember-me"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.b").isString())
            .andExpect(jsonPath("$.salt").isString())
            .andReturn()
            .getResponse();

        assertThat(mockResponse.getContentType()).isEqualTo(MediaType.APPLICATION_JSON_UTF8_VALUE);
        assertThat(mockResponse.getContentAsByteArray()).isNotNull();
    }

    @Test
    @Transactional
    public void testPreAuthenticateFailedUsernameNotFound() throws Exception {
        LoginVM login = new LoginVM();
        login.setUsername("usernotfound");
        login.setPassword("test");
        ResultActions actions = mockMvc.perform(post("/api/preauthenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content("usernotfound"))
            .andExpect(status().isNotFound());
    }
}

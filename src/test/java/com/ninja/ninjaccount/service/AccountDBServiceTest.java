package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.domain.AccountsDB;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.AccountsDBRepository;
import com.ninja.ninjaccount.repository.UserRepository;
import com.ninja.ninjaccount.security.AuthoritiesConstants;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
import com.ninja.ninjaccount.service.dto.OperationAccountType;
import com.ninja.ninjaccount.service.util.PaymentConstant;
import com.ninja.ninjaccount.service.dto.UserDTO;
import com.ninja.ninjaccount.service.exceptions.MaxAccountsException;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.util.Pair;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = NinjaccountApp.class)
@Transactional
public class AccountDBServiceTest {

    @Autowired
    private AccountsDBService accountsDBService;

    @Autowired
    private AccountsDBRepository accountsDBRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private User userJohn;

    @Before
    public void init() {
        userJohn = new User();
        userJohn.setLogin("johndoe");
        userJohn.setPassword(RandomStringUtils.random(60));
        userJohn.setActivated(true);
        userJohn.setEmail("johndoe@localhost");
        userJohn.setFirstName("john");
        userJohn.setLastName("doe");
        userJohn.setImageUrl("http://placehold.it/50x50");
        userJohn.setLangKey("en");
    }

    @Test
    public void testCreationEncryptedDB() {
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userRepository.saveAndFlush(userJohn);

        AccountsDBDTO accountsDBDTO = accountsDBService.createNewAccountDB(bytes, uuid, user);
        assertThat(accountsDBDTO.getId()).isNotNull();
        assertThat(accountsDBDTO.getDatabase()).isNotNull();
        assertThat(accountsDBDTO.getInitializationVector()).isNotNull();
        assertThat(accountsDBDTO.getInitializationVector()).isEqualToIgnoringCase(uuid);
        assertThat(accountsDBDTO.getDatabaseContentType()).isNotNull();
        assertThat(accountsDBDTO.getDatabaseContentType()).isEqualToIgnoringCase(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        assertThat(accountsDBDTO.getUserId()).isEqualTo(user.getId());
    }

    @Test
    public void testGetAccountsByUsernameLogin() {
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userRepository.saveAndFlush(userJohn);
        accountsDBService.createNewAccountDB(bytes, uuid, user);
        Optional<AccountsDB> accountsDB = accountsDBRepository.findOneByUserLogin("johndoe");
        assertThat(accountsDB.isPresent()).isTrue();
        assertThat(accountsDB.get().getInitializationVector()).isNotNull();
        assertThat(accountsDB.get().getDatabase()).isNotNull();
    }

    @Test
    @WithMockUser("johndoe")
    public void testUpdateAccountsByUserconnected() throws MaxAccountsException {
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userRepository.saveAndFlush(userJohn);
        accountsDBService.createNewAccountDB(bytes, uuid, user);
        paymentService.createRegistrationPaymentForUser(user);

        String updatedExample = "This is an updated example";
        byte[] updatedBytes = updatedExample.getBytes();
        String updatedUuid = UUID.randomUUID().toString();

        AccountsDBDTO newAccountsDBDTO = new AccountsDBDTO();
        newAccountsDBDTO.setDatabase(updatedBytes);
        newAccountsDBDTO.setInitializationVector(updatedUuid);
        newAccountsDBDTO.setSum(accountsDBService.calculateSum(updatedBytes));
        newAccountsDBDTO.setOperationAccountType(OperationAccountType.CREATE);

        AccountsDBDTO updatedAccountDB = accountsDBService.updateAccountDBForUserConnected(newAccountsDBDTO);
        assertThat(updatedAccountDB).isNotNull();
        assertThat(updatedAccountDB.getInitializationVector()).isNotEqualTo(uuid);
        assertThat(updatedAccountDB.getDatabase()).isNotEqualTo(bytes);
    }

    @Test
    public void testGetActualAndMaxAccount() throws MaxAccountsException {
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(true);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        AccountsDBDTO accountsDBDTO = accountsDBService.createNewAccountDB(bytes, uuid, user);
        accountsDBDTO.setNbAccounts(1);
        accountsDBService.checkSumAndSave(accountsDBDTO);

        paymentService.createRegistrationPaymentForUser(user);

        Pair<Integer, Integer> actualAndMax = accountsDBService.getActualAndMaxAccount(user.getLogin());

        assertThat(actualAndMax).isNotNull();
        assertThat(actualAndMax.getFirst()).isNotNull();
        assertThat(actualAndMax.getFirst()).isEqualTo(1);
        assertThat(actualAndMax.getSecond()).isNotNull();
        assertThat(actualAndMax.getSecond()).isEqualTo(PaymentConstant.MAX_ACCOUNTS_BETA);
    }

    @Test
    public void testChecksumShouldValidate() {
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userRepository.saveAndFlush(userJohn);
        AccountsDBDTO accountsDBDTO = accountsDBService.createNewAccountDB(bytes, uuid, user);
        accountsDBDTO.setSum(accountsDBService.calculateSum(accountsDBDTO.getDatabase()));

        boolean check = accountsDBService.checkDBSum(accountsDBDTO.getDatabase(), accountsDBDTO.getSum());

        assertThat(check).isTrue();
    }

    @Test
    public void testChecksumShouldBeUnvalide() {
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userRepository.saveAndFlush(userJohn);
        AccountsDBDTO accountsDBDTO = accountsDBService.createNewAccountDB(bytes, uuid, user);
        accountsDBDTO.setSum("loool");

        boolean check = accountsDBService.checkDBSum(accountsDBDTO.getDatabase(), accountsDBDTO.getSum());

        assertThat(check).isFalse();
    }

    @Test
    public void testUpdateActualCountAccount() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("johndoe", "johndoe", authorities));
        SecurityContextHolder.setContext(securityContext);

        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userRepository.saveAndFlush(userJohn);
        AccountsDBDTO accountsDBDTO = accountsDBService.createNewAccountDB(bytes, uuid, user);
        accountsDBDTO.setNbAccounts(1);
        AccountsDBDTO accountsDBDTOSaved = accountsDBService.checkSumAndSave(accountsDBDTO);

        assertThat(accountsDBDTOSaved.getNbAccounts()).isEqualTo(1);

        int newActualNumber = accountsDBService.updateNumberActualAccount("johndoe", 20);

        AccountsDBDTO accountsDBDTOToVerify = accountsDBService.findOne(accountsDBDTO.getId());

        assertThat(newActualNumber).isEqualTo(20);
        assertThat(accountsDBDTOToVerify.getNbAccounts()).isEqualTo(20);
    }
}

package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.domain.AccountsDB;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.AccountsDBRepository;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
import com.ninja.ninjaccount.service.util.PaymentConstant;
import com.ninja.ninjaccount.service.dto.UserDTO;
import com.ninja.ninjaccount.service.exceptions.MaxAccountsException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.util.Pair;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

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

    @Test
    public void testCreationEncryptedDB() {
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userService.createUser("johndoe", "johndoe", "John", "Doe", "john.doe@localhost", "http://placehold.it/50x50", "en-US");

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

        User user = userService.createUser("johndoe", "johndoe", "John", "Doe", "john.doe@localhost", "http://placehold.it/50x50", "en-US");
        accountsDBService.createNewAccountDB(bytes, uuid, user);
        Optional<AccountsDB> accountsDB = accountsDBRepository.findOneByUserLogin("johndoe");
        assertThat(accountsDB.isPresent()).isTrue();
        assertThat(accountsDB.get().getInitializationVector()).isNotNull();
        assertThat(accountsDB.get().getDatabase()).isNotNull();
    }

    @Test
    @WithMockUser("user-update-db")
    public void testUpdateAccountsByUserconnected() throws MaxAccountsException {
        String example = "This is an example";
        byte[] bytes = example.getBytes();
        String uuid = UUID.randomUUID().toString();

        User user = userService.createUser("user-update-db", "johndoe", "John", "Doe", "john.doe@localhost", "http://placehold.it/50x50", "en-US");
        accountsDBService.createNewAccountDB(bytes, uuid, user);

        String updatedExample = "This is an updated example";
        byte[] updatedBytes = updatedExample.getBytes();
        String updatedUuid = UUID.randomUUID().toString();

        AccountsDBDTO newAccountsDBDTO = new AccountsDBDTO();
        newAccountsDBDTO.setDatabase(updatedBytes);
        newAccountsDBDTO.setInitializationVector(updatedUuid);

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
        accountsDBService.save(accountsDBDTO);

        paymentService.createRegistrationPaymentForUser(user);

        Pair<Integer, Integer> actualAndMax = accountsDBService.getActualAndMaxAccount(user.getLogin());

        assertThat(actualAndMax).isNotNull();
        assertThat(actualAndMax.getFirst()).isNotNull();
        assertThat(actualAndMax.getFirst()).isEqualTo(1);
        assertThat(actualAndMax.getSecond()).isNotNull();
        assertThat(actualAndMax.getSecond()).isEqualTo(PaymentConstant.MAX_ACCOUNTS_BETA);
    }
}

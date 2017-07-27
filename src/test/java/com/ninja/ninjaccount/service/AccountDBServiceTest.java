package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.repository.AccountsDBRepository;
import com.ninja.ninjaccount.service.dto.AccountsDBDTO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

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

}

package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.domain.Payment;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.repository.PaymentRepository;
import com.ninja.ninjaccount.service.dto.OperationAccountType;
import com.ninja.ninjaccount.service.dto.UserDTO;
import com.ninja.ninjaccount.service.exceptions.MaxAccountsException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = NinjaccountApp.class)
@Transactional
public class PaymentServiceTest {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Test
    public void testCreatePaymentWhenRegister() {
        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(true);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        paymentService.createRegistrationPaymentForUser(user);

        Optional<Payment> payment = paymentRepository.findOneByUserLogin("lol");

        assertThat(payment.isPresent()).isTrue();
        assertThat(payment.get().getPlanType()).isEqualTo(PlanType.BETA);
        assertThat(payment.get().isPaid()).isFalse();
        assertThat(payment.get().getSubscriptionDate()).isEqualTo(LocalDate.now().plusMonths(1));
    }

    @Test
    public void testCheckReachLimitNotReached() throws MaxAccountsException {
        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(true);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        paymentService.createRegistrationPaymentForUser(user);

        Integer nbAccounts = paymentService.checkReachLimitAccounts(user.getLogin(), OperationAccountType.CREATE, 1);

        assertThat(nbAccounts).isNotNull();
        assertThat(nbAccounts).isEqualTo(2);
    }

    @Test(expected = MaxAccountsException.class)
    public void testCheckReachLimitReached() throws MaxAccountsException {
        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(true);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        paymentService.createRegistrationPaymentForUser(user);
        paymentService.checkReachLimitAccounts(user.getLogin(), OperationAccountType.CREATE, 1000);
    }

    @Test
    public void testCheckReachLimitUpdateDontMove() throws MaxAccountsException {
        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(true);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        paymentService.createRegistrationPaymentForUser(user);

        Integer nbAccounts = paymentService.checkReachLimitAccounts(user.getLogin(), OperationAccountType.UPDATE, 1);

        assertThat(nbAccounts).isNotNull();
        assertThat(nbAccounts).isEqualTo(1);
    }

    @Test
    public void testCheckReachLimitDelete() throws MaxAccountsException {
        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(true);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        paymentService.createRegistrationPaymentForUser(user);

        Integer nbAccounts = paymentService.checkReachLimitAccounts(user.getLogin(), OperationAccountType.DELETE, 2);

        assertThat(nbAccounts).isNotNull();
        assertThat(nbAccounts).isEqualTo(1);
    }
}

package com.ninja.ninjaccount.service;

import com.netflix.discovery.converters.Auto;
import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.domain.Payment;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.repository.PaymentRepository;
import com.ninja.ninjaccount.service.dto.UserDTO;
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
        assertThat(payment.get().getPlanType()).isEqualTo(PlanType.FREE);
        assertThat(payment.get().isPaid()).isFalse();
        assertThat(payment.get().getSubscriptionDate()).isEqualTo(LocalDate.now().plusMonths(1));
    }

}

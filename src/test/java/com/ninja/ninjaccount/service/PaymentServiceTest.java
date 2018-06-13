package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.domain.Payment;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.repository.PaymentRepository;
import com.ninja.ninjaccount.repository.UserRepository;
import com.ninja.ninjaccount.service.billing.PaypalService;
import com.ninja.ninjaccount.service.billing.dto.CompletePaymentDTO;
import com.ninja.ninjaccount.service.billing.dto.ReturnPaymentDTO;
import com.ninja.ninjaccount.service.dto.OperationAccountType;
import com.ninja.ninjaccount.service.dto.PaymentDTO;
import com.ninja.ninjaccount.service.dto.UserDTO;
import com.ninja.ninjaccount.service.exceptions.MaxAccountsException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;

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

    @MockBean
    private PaypalService paypalService;

    @Autowired
    private UserRepository userRepository;

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
        assertThat(payment.get().getSubscriptionDate()).isEqualTo(LocalDate.now());
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

    @Test
    public void testInitPaymentWorkflowYearShouldWork() throws MaxAccountsException {
        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(true);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        user.setActivated(false);
        userRepository.save(user);

        ReturnPaymentDTO returnPaymentDTOMock = new ReturnPaymentDTO();
        returnPaymentDTOMock.setStatus("success");
        returnPaymentDTOMock.setReturnUrl("http://getrich.com");
        returnPaymentDTOMock.setPaymentId("PAY-LOL");

        Mockito.when(paypalService.createOneTimePayment(any(PlanType.class), eq(user.getLogin()))).thenReturn(returnPaymentDTOMock);

        paymentService.createRegistrationPaymentForUser(user);

        Optional<ReturnPaymentDTO> returnPaymentDTO = paymentService.initOneTimePaymentWorkflow(PlanType.PREMIUMYEAR, user.getLogin());

        Optional<Payment> payment = paymentRepository.findOneByUserLogin(user.getLogin());

        assertThat(returnPaymentDTO).isPresent();
        assertThat(payment).isPresent();
        assertThat(payment.get().getLastPaymentId()).isEqualTo(returnPaymentDTOMock.getPaymentId());
    }

    @Test
    public void testInitPaymentWorkflowYearShouldFail() {
        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(false);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        user.setActivated(false);
        userRepository.save(user);

        ReturnPaymentDTO returnPaymentDTOMock = new ReturnPaymentDTO();
        returnPaymentDTOMock.setStatus("failure");

        Mockito.when(paypalService.createOneTimePayment(any(PlanType.class), eq(user.getLogin()))).thenReturn(returnPaymentDTOMock);

        paymentService.createRegistrationPaymentForUser(user);

        Optional<ReturnPaymentDTO> returnPaymentDTO = paymentService.initOneTimePaymentWorkflow(PlanType.PREMIUMYEAR, user.getLogin());

        Optional<Payment> payment = paymentRepository.findOneByUserLogin(user.getLogin());
        Optional<User> userWithAuthoritiesByLogin = userService.getUserWithAuthoritiesByLogin(user.getLogin());

        assertThat(userWithAuthoritiesByLogin).isNotPresent();
        assertThat(returnPaymentDTO).isNotPresent();
        assertThat(payment).isNotPresent();
    }

    @Test
    public void testCompletePaymentShouldWork() {
        String paymentId = "PAY-ID";

        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(false);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        user.setActivated(false);
        user = userRepository.save(user);

        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setPaid(false);
        paymentDTO.setPlanType(PlanType.FREE);
        paymentDTO.setSubscriptionDate(LocalDate.now());
        paymentDTO.setPrice(PlanType.FREE.getPrice());
        paymentDTO.setUserId(user.getId());
        paymentDTO.setUserLogin(user.getLogin());
        paymentDTO.setLastPaymentId(paymentId);

        paymentService.save(paymentDTO);

        //Create the mock object for the paypal call
        ReturnPaymentDTO returnPaymentDTOMock = new ReturnPaymentDTO();
        returnPaymentDTOMock.setStatus("success");
        returnPaymentDTOMock.setPaymentId(paymentId);
        returnPaymentDTOMock.setPlanType(PlanType.PREMIUMYEAR);

        //Mock the call
        Mockito.when(paypalService.completeOneTimePaymentWorkflow(any(CompletePaymentDTO.class))).thenReturn(Optional.of(returnPaymentDTOMock));

        CompletePaymentDTO completePaymentDTO = new CompletePaymentDTO();
        completePaymentDTO.setPayerId("PAY-BLABLA");
        completePaymentDTO.setPaymentId(paymentId);

        Optional<ReturnPaymentDTO> returnPaymentDTO = paymentService.completeOneTimePaymentWorkflow(completePaymentDTO);

        Optional<Payment> payment = paymentRepository.findOneByUserLogin(user.getLogin());

        assertThat(returnPaymentDTO).isPresent();
        assertThat(payment).isPresent();
        assertThat(payment.get().getPlanType()).isEqualTo(PlanType.PREMIUMYEAR);
        assertThat(payment.get().getPrice()).isEqualTo(PlanType.PREMIUMYEAR.getPrice());
        assertThat(payment.get().getValidUntil()).isEqualTo(LocalDate.now()
            .plus(PlanType.PREMIUMYEAR.getUnitAmountValidity(), PlanType.PREMIUMYEAR.getUnit()));
    }

    @Test
    public void testCompletePaymentShouldFail() {
        String paymentId = "PAY-ID";

        User user = new User();
        user.setEmail("lol@lol.com");
        user.setLogin("lol");
        user.setActivated(false);
        user.setPassword("loooool");
        user = userService.createUser(new UserDTO(user));

        user.setActivated(false);
        user = userRepository.save(user);

        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setPaid(false);
        paymentDTO.setPlanType(PlanType.FREE);
        paymentDTO.setSubscriptionDate(LocalDate.now());
        paymentDTO.setPrice(PlanType.FREE.getPrice());
        paymentDTO.setUserId(user.getId());
        paymentDTO.setUserLogin(user.getLogin());
        paymentDTO.setLastPaymentId(paymentId);

        paymentService.save(paymentDTO);

        //Create the mock object for the paypal call
        ReturnPaymentDTO returnPaymentDTOMock = new ReturnPaymentDTO();
        returnPaymentDTOMock.setStatus("failure");
        returnPaymentDTOMock.setPaymentId(paymentId);
        returnPaymentDTOMock.setPlanType(PlanType.PREMIUMYEAR);

        //Mock the call
        Mockito.when(paypalService.completeOneTimePaymentWorkflow(any(CompletePaymentDTO.class))).thenReturn(Optional.of(returnPaymentDTOMock));

        CompletePaymentDTO completePaymentDTO = new CompletePaymentDTO();
        completePaymentDTO.setPayerId("PAY-BLABLA");
        completePaymentDTO.setPaymentId(paymentId);

        Optional<ReturnPaymentDTO> returnPaymentDTO = paymentService.completeOneTimePaymentWorkflow(completePaymentDTO);

        Optional<Payment> payment = paymentRepository.findOneByUserLogin(user.getLogin());

        Optional<User> userWithAuthoritiesByLogin = userService.getUserWithAuthoritiesByLogin(user.getLogin());

        assertThat(userWithAuthoritiesByLogin).isNotPresent();
        assertThat(returnPaymentDTO).isNotPresent();
        assertThat(payment).isNotPresent();
    }

}

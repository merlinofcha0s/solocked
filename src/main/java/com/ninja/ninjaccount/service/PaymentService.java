package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.domain.Payment;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.repository.PaymentRepository;
import com.ninja.ninjaccount.security.SecurityUtils;
import com.ninja.ninjaccount.service.billing.PaypalService;
import com.ninja.ninjaccount.service.billing.dto.CompletePaymentDTO;
import com.ninja.ninjaccount.service.billing.dto.PaypalStatus;
import com.ninja.ninjaccount.service.billing.dto.ReturnPaymentDTO;
import com.ninja.ninjaccount.service.dto.OperationAccountType;
import com.ninja.ninjaccount.service.dto.PaymentDTO;
import com.ninja.ninjaccount.service.exceptions.MaxAccountsException;
import com.ninja.ninjaccount.service.mapper.PaymentMapper;
import com.ninja.ninjaccount.service.util.PaymentUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.audit.AuditEventRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Payment.
 */
@Service
@Transactional
public class PaymentService {

    private final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;

    private final PaymentMapper paymentMapper;

    private final PaypalService paypalService;

    private final UserService userService;

    private final AuditEventRepository auditEventRepository;

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper,
                          PaypalService paypalService, UserService userService, AuditEventRepository auditEventRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.paypalService = paypalService;
        this.userService = userService;
        this.auditEventRepository = auditEventRepository;
    }

    /**
     * Save a payment.
     *
     * @param paymentDTO the entity to save
     * @return the persisted entity
     */
    public PaymentDTO save(PaymentDTO paymentDTO) {
        log.debug("Request to save Payment : {}", paymentDTO);
        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment = paymentRepository.save(payment);
        return paymentMapper.toDto(payment);
    }

    /**
     * Get all the payments.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> findAll() {
        log.debug("Request to get all Payments");
        return paymentRepository.findAll().stream()
            .map(paymentMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one payment by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<PaymentDTO> findOne(Long id) {
        log.debug("Request to get Payment : {}", id);
        return paymentRepository.findById(id)
            .map(paymentMapper::toDto);
    }

    /**
     * Delete the payment by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Payment : {}", id);        paymentRepository.deleteById(id);
    }

    /**
     * Get payment information for one user by login
     *
     * @param login The login of the user
     * @return The payment information
     */
    public PaymentDTO findPaymentByLogin(String login) {
        Optional<Payment> payment = paymentRepository.findOneByUserLogin(login);
        if (payment.isPresent()) {
            return paymentMapper.toDto(payment.get());
        } else {
            return null;
        }
    }

    /**
     * Create a payment for user when first register
     * With one month free
     *
     * @param user the user
     */
    public PaymentDTO createRegistrationPaymentForUser(User user) {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setPaid(false);
        paymentDTO.setPlanType(PlanType.FREE);
        paymentDTO.setSubscriptionDate(LocalDate.now());
        paymentDTO.setPrice(PlanType.FREE.getPrice());
        paymentDTO.setUserId(user.getId());
        paymentDTO.setUserLogin(user.getLogin());
        paymentDTO.setRecurring(false);
        return save(paymentDTO);
    }

    public Integer checkReachLimitAccounts(String userLogin, OperationAccountType operationAccountType, Integer actual) throws MaxAccountsException {
        PaymentDTO paymentDTO = findPaymentByLogin(userLogin);

        if (operationAccountType.equals(OperationAccountType.CREATE)) {
            Integer maxAccounts = PaymentUtil.getMaxAccountByPlanType(paymentDTO.getPlanType());

            if (actual < maxAccounts) {
                return actual + 1;
            } else {
                throw new MaxAccountsException(actual, maxAccounts);
            }
        } else if (operationAccountType.equals(OperationAccountType.DELETE)) {
            return actual - 1;
        } else if (operationAccountType.equals(OperationAccountType.DELETE_ALL)) {
            return 0;
        } else {
            return actual;
        }
    }

    public Optional<ReturnPaymentDTO> initOneTimePaymentWorkflow(PlanType planType, String login) {

        ReturnPaymentDTO returnPaymentDTO = paypalService.createOneTimePayment(planType, login);

        Optional<Payment> payment = paymentRepository.findOneByUserLogin(login);

        if (payment.isPresent() && returnPaymentDTO.getStatus().equals(PaypalStatus.SUCCESS.getName())) {
            payment.get().setLastPaymentId(returnPaymentDTO.getPaymentId());
            paymentRepository.save(payment.get());
        }

        if (returnPaymentDTO.getStatus().equals(PaypalStatus.FAILURE.getName())) {
            // Rollback
            userService.destroyUserByLoginNotActivated(login);
            return Optional.empty();
        }

        return Optional.of(returnPaymentDTO);
    }

    public Optional<ReturnPaymentDTO> completeOneTimePaymentWorkflow(CompletePaymentDTO completePaymentDTO) {
        Optional<ReturnPaymentDTO> returnPaymentDTOOpt = paypalService.completeOneTimePaymentWorkflow(completePaymentDTO);

        if (returnPaymentDTOOpt.isPresent() && returnPaymentDTOOpt.get().getStatus().equals(PaypalStatus.SUCCESS.getName())) {
            ReturnPaymentDTO returnPaymentDTO = returnPaymentDTOOpt.get();
            Optional<Payment> paymentToComplete = paymentRepository.findOneByLastPaymentId(returnPaymentDTO.getPaymentId());

            if (paymentToComplete.isPresent()) {
                upgradePlan(returnPaymentDTO.getPlanType(), paymentToComplete.get());
            } else {
                log.error("BIG PROBLEM !!! No payment found for the payment ID {} ", completePaymentDTO.getPaymentId());
            }

        } else if (returnPaymentDTOOpt.isPresent() && returnPaymentDTOOpt.get().getStatus().equals(PaypalStatus.FAILURE.getName())) {
            Optional<Payment> paymentToComplete = paymentRepository.findOneByLastPaymentId(completePaymentDTO.getPaymentId());
            paymentToComplete.map(payment -> payment.getUser().getId())
                .flatMap(userService::getUserWithAuthorities)
                .ifPresent(user -> userService.destroyUserByLoginNotActivated(user.getLogin()));
            return Optional.empty();
        }

        return returnPaymentDTOOpt;
    }

    public boolean checkIfCanUpdateDB() {
        boolean canUpdate = false;
        Optional<String> login = SecurityUtils.getCurrentUserLogin();

        if (login.isPresent()) {
            PaymentDTO paymentByLogin = findPaymentByLogin(login.get());
            if (!paymentByLogin.getPlanType().equals(PlanType.FREE)) {
                if (paymentByLogin.isPaid() && paymentByLogin.getValidUntil().isAfter(LocalDate.now())) {
                    canUpdate = true;
                }
            } else {
                canUpdate = true;
            }
        }

        return canUpdate;
    }

    public Optional<ReturnPaymentDTO> initRecurringPaymentWorkflow(PlanType planType, String login) {
        ReturnPaymentDTO returnPaymentDTO = null;
        Optional<Payment> payment = paymentRepository.findOneByUserLogin(login);

        if (payment.isPresent()) {

            LocalDate startDate = computeStartDate(payment.get(), planType);
            boolean billImmediately = payment.get().getValidUntil() == null;
            returnPaymentDTO = paypalService.createRecurringPayment(planType, login, startDate, billImmediately);

            if (returnPaymentDTO.getStatus().equals(PaypalStatus.SUCCESS.getName())) {
                payment.get().setTokenRecurring(returnPaymentDTO.getTokenForRecurring());
                payment.get().setBillingPlanId(returnPaymentDTO.getBillingPlanId());
                paymentRepository.save(payment.get());
            }

            if (returnPaymentDTO.getStatus().equals(PaypalStatus.FAILURE.getName())) {
                return Optional.empty();
            }
        }

        return Optional.ofNullable(returnPaymentDTO);
    }

    public Optional<ReturnPaymentDTO> completeRecurringPaymentWorkflow(CompletePaymentDTO completePaymentDTO) {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        if (login.isPresent()) {

            ReturnPaymentDTO returnPaymentDTO = paypalService.completeRecurringPaymentWorkflow(completePaymentDTO.getToken(), login.get());

            if (returnPaymentDTO.getStatus().equals(PaypalStatus.SUCCESS.getName())) {
                Optional<Payment> paymentToComplete = paymentRepository.findOneByTokenRecurringAndUserLogin(completePaymentDTO.getToken(), login.get());
                if (paymentToComplete.isPresent()) {
                    //The agreement ID
                    paymentToComplete.get().setRecurring(true);
                    paymentToComplete.get().setLastPaymentId(returnPaymentDTO.getPaymentId());
                    upgradePlan(returnPaymentDTO.getPlanType(), paymentToComplete.get());
                } else {
                    log.error("BIG PROBLEM !!! No payment found for the payment ID {} ", completePaymentDTO.getPaymentId());
                }
            }

            return Optional.of(returnPaymentDTO);
        } else {
            return Optional.empty();
        }
    }

    private void upgradePlan(PlanType planType, Payment paymentToComplete) {
        paymentToComplete.setPaid(true);
        paymentToComplete.setPlanType(planType);
        paymentToComplete.setSubscriptionDate(LocalDate.now());
        paymentToComplete.setPrice(planType.getPrice());
        paymentToComplete.setValidUntil(computeStartDate(paymentToComplete, planType));
        paymentRepository.save(paymentToComplete);
    }

    public Optional<ReturnPaymentDTO> cancelRecurringPaymentWorkflow(String login) {
        ReturnPaymentDTO returnPaymentDTO = null;
        Optional<Payment> paymentToCancel = paymentRepository.findOneByUserLogin(login);
        if (paymentToCancel.isPresent() && paymentToCancel.get().isRecurring()) {
            returnPaymentDTO = paypalService.cancelRecurringPayment(paymentToCancel.get().getLastPaymentId(), login);
            if (returnPaymentDTO.getStatus().equals(PaypalStatus.SUCCESS.getName())) {
                deactivateRecurring(paymentToCancel.get());
            }
            returnPaymentDTO.setPaymentId(paymentToCancel.get().getLastPaymentId());
        }
        return Optional.ofNullable(returnPaymentDTO);
    }

    public LocalDate computeStartDate(Payment payment, PlanType planType) {
        if (payment.getValidUntil() == null) {
            return LocalDate.now().plus(planType.getUnitAmountValidity(), planType.getUnit());
        } else {
            return payment.getValidUntil();
        }
    }

    @Scheduled(cron = "0 0 2 * * ?")
    public void checkSubscriptionFromPaypal() {
        List<Payment> paymentsRecurring = paymentRepository.findAllByRecurringTrue();
        log.info("Payment to check : " + paymentsRecurring.size());

        List<Payment> paymentNotActivateOrPending = paymentsRecurring.stream()
            .filter(this::excludePaymentActiveAndPending)
            .collect(Collectors.toList());

        log.info("Payment to deactivate : " + paymentNotActivateOrPending.size());

        paymentNotActivateOrPending.forEach(this::deactivateRecurring);
    }

    private boolean excludePaymentActiveAndPending(Payment payment) {
        PaypalStatus paypalStatus = paypalService.checkAgreementStillActive(payment.getLastPaymentId());
        return paypalStatus != PaypalStatus.ACTIVE && paypalStatus != PaypalStatus.PAYMENT_PENDING;
    }

    private void deactivateRecurring(Payment payment) {
        payment.setRecurring(false);
        paymentRepository.save(payment);
    }
}

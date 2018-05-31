package com.ninja.ninjaccount.service;

import com.ninja.ninjaccount.domain.Payment;
import com.ninja.ninjaccount.domain.User;
import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.repository.PaymentRepository;
import com.ninja.ninjaccount.service.billing.PaypalService;
import com.ninja.ninjaccount.service.dto.CompletePaymentDTO;
import com.ninja.ninjaccount.service.dto.OperationAccountType;
import com.ninja.ninjaccount.service.dto.PaymentDTO;
import com.ninja.ninjaccount.service.exceptions.MaxAccountsException;
import com.ninja.ninjaccount.service.mapper.PaymentMapper;
import com.ninja.ninjaccount.service.util.PaymentUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
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

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper, PaypalService paypalService) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.paypalService = paypalService;
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
    public PaymentDTO findOne(Long id) {
        log.debug("Request to get Payment : {}", id);
        Payment payment = paymentRepository.findOne(id);
        return paymentMapper.toDto(payment);
    }

    /**
     * Delete the payment by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Payment : {}", id);
        paymentRepository.delete(id);
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
        } else {
            return actual;
        }
    }

    public Optional<Map<String, String>> initPaymentWorkflow(PlanType planType, String login) {

        Optional<Map<String, String>> results = Optional.empty();

        if (planType == PlanType.PREMIUMYEAR) {
            results = Optional.of(paypalService.createPayment(PlanType.PREMIUMYEAR.getPrice().toString()));
        }

        Optional<Payment> payment = paymentRepository.findOneByUserLogin(login);

        if (payment.isPresent() && results.isPresent()) {
            payment.get().setPayerId(results.get().get("id"));
            paymentRepository.save(payment.get());
        }

        return results;
    }

    public Optional<Map<String, String>> completePaymentWorkflow(CompletePaymentDTO completePaymentDTO) {
        return Optional.of(paypalService.completePaymentWorkflow(completePaymentDTO));
    }

}

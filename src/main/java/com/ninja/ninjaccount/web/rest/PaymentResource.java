package com.ninja.ninjaccount.web.rest;

import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.security.SecurityUtils;
import com.ninja.ninjaccount.service.PaymentService;
import com.ninja.ninjaccount.service.billing.dto.CompletePaymentDTO;
import com.ninja.ninjaccount.service.billing.dto.InitPaymentDTO;
import com.ninja.ninjaccount.service.billing.dto.PaypalStatus;
import com.ninja.ninjaccount.service.billing.dto.ReturnPaymentDTO;
import com.ninja.ninjaccount.service.dto.PaymentDTO;
import com.ninja.ninjaccount.web.rest.errors.*;
import com.ninja.ninjaccount.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zalando.problem.Status;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Payment.
 */
@RestController
@RequestMapping("/api")
public class PaymentResource {

    private final Logger log = LoggerFactory.getLogger(PaymentResource.class);

    private static final String ENTITY_NAME = "payment";

    private final PaymentService paymentService;

    public PaymentResource(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * POST  /payments : Create a new payment.
     *
     * @param paymentDTO the paymentDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new paymentDTO, or with status 400 (Bad Request) if the payment has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/payments")
    public ResponseEntity<PaymentDTO> createPayment(@Valid @RequestBody PaymentDTO paymentDTO) throws URISyntaxException {
        log.debug("REST request to save Payment : {}", paymentDTO);
        if (paymentDTO.getId() != null) {
            throw new BadRequestAlertException("A new payment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentDTO result = paymentService.save(paymentDTO);
        return ResponseEntity.created(new URI("/api/payments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /payments : Updates an existing payment.
     *
     * @param paymentDTO the paymentDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated paymentDTO,
     * or with status 400 (Bad Request) if the paymentDTO is not valid,
     * or with status 500 (Internal Server Error) if the paymentDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/payments")
    public ResponseEntity<PaymentDTO> updatePayment(@Valid @RequestBody PaymentDTO paymentDTO) throws URISyntaxException {
        log.debug("REST request to update Payment : {}", paymentDTO);
        if (paymentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PaymentDTO result = paymentService.save(paymentDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, paymentDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /payments : get all the payments.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of payments in body
     */
    @GetMapping("/payments")
    public List<PaymentDTO> getAllPayments() {
        log.debug("REST request to get all Payments");
        return paymentService.findAll();
    }

    /**
     * GET  /payments/:id : get the "id" payment.
     *
     * @param id the id of the paymentDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paymentDTO, or with status 404 (Not Found)
     */
    @GetMapping("/payments/{id}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable Long id) {
        log.debug("REST request to get Payment : {}", id);
        Optional<PaymentDTO> paymentDTO = paymentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(paymentDTO);
    }

    /**
     * DELETE  /payments/:id : delete the "id" payment.
     *
     * @param id the id of the paymentDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        log.debug("REST request to delete Payment : {}", id);
        paymentService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * GET  /payments-by-login/
     *
     * @return the ResponseEntity with status 200 (OK) and with body the paymentDTO, or with status 404 (Not Found)
     */
    @GetMapping("/payments-by-login")
    public ResponseEntity<PaymentDTO> getPaymentByLogin() {
        PaymentDTO paymentDTO = null;
        Optional<String> login = SecurityUtils.getCurrentUserLogin();

        if (login.isPresent()) {
            log.debug("REST request to get payment method by login : {}", login.get());
            paymentDTO = paymentService.findPaymentByLogin(login.get());
        } else {
            log.error("REST request to get payment method without login !!!!!");
        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(paymentDTO));
    }

    @PostMapping("/init-one-time-payment")
    public ResponseEntity<ReturnPaymentDTO> initPaymentOneTimeWorkflow(@Valid @RequestBody InitPaymentDTO initPaymentDTO) {

        Optional<ReturnPaymentDTO> results = paymentService.initOneTimePaymentWorkflow(PlanType.valueOf(initPaymentDTO.getPlanType().toString()), initPaymentDTO.getLogin());

        if (results.isPresent()) {
            return ResponseEntity.ok(results.get());
        } else {
            throw new PaypalCommunicationException();
        }
    }

    @PostMapping("/complete-one-time-payment")
    public ResponseEntity<ReturnPaymentDTO> completeOneTimePaymentWorkflow(@Valid @RequestBody CompletePaymentDTO completePaymentDTO) {

        Optional<ReturnPaymentDTO> results = paymentService.completeOneTimePaymentWorkflow(completePaymentDTO);

        if (results.isPresent()) {
            return ResponseEntity.ok(results.get());
        } else {
            throw new PaypalCommunicationException();
        }
    }

    @PostMapping("/init-recurring-payment")
    public ResponseEntity<ReturnPaymentDTO> initRecurringPaymentWorkflow(@Valid @RequestBody InitPaymentDTO initPaymentDTO) {
        Optional<String> loginOpt = SecurityUtils.getCurrentUserLogin();
        Optional<ReturnPaymentDTO> results = loginOpt
            .flatMap((login) -> paymentService.initRecurringPaymentWorkflow(PlanType.valueOf(initPaymentDTO.getPlanType().toString()), login));

        if (results.isPresent()) {
            return ResponseEntity.ok(results.get());
        } else {
            throw new PaypalCommunicationException();
        }
    }

    @PostMapping("/complete-recurring-payment")
    public ResponseEntity<ReturnPaymentDTO> completeRecurringPaymentWorkflow(@Valid @RequestBody CompletePaymentDTO completePaymentDTO) {

        Optional<ReturnPaymentDTO> results = paymentService.completeRecurringPaymentWorkflow(completePaymentDTO);

        if (results.isPresent()) {
            if (results.get().getStatus().equals(PaypalStatus.SUCCESS.getName())) {
                return ResponseEntity.ok(results.get());
            } else if (results.get().getStatus().equals(PaypalStatus.FAILURE.getName())) {
                throw new CompletePaymentException(ErrorConstants.PAYPAL_COMMUNICATION_PROBLEM, "Problem when communicating with paypal", Status.SERVICE_UNAVAILABLE);
            } else if (results.get().getStatus().equals(PaypalStatus.PAYMENT_PENDING.getName())) {
                throw new CompletePaymentException(ErrorConstants.PAYMENT_PENDING, "Your agreeement is in pending state", Status.NOT_ACCEPTABLE);
            } else {
                log.error("No status from paypal, payment id {}", completePaymentDTO.getPaymentId());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/cancel-recurring-payment")
    public ResponseEntity<ReturnPaymentDTO> cancelRecurringPaymentWorkflow() {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        if (login.isPresent()) {
            Optional<ReturnPaymentDTO> results = paymentService.cancelRecurringPaymentWorkflow(login.get());
            if (results.isPresent()) {
                return ResponseEntity.ok(results.get());
            } else {
                throw new CustomParameterizedException("Problem when canceling payment", login.get());
            }
        } else {
            throw new CustomParameterizedException("Not connected");
        }
    }
}

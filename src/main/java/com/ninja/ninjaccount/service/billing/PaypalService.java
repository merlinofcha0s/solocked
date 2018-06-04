package com.ninja.ninjaccount.service.billing;

import com.ninja.ninjaccount.service.billing.dto.CompletePaymentDTO;
import com.ninja.ninjaccount.service.billing.dto.ReturnPaymentDTO;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PaypalService {

    @Value("${application.paypal.client-id}")
    private String clientId;
    @Value("${application.paypal.client-secret}")
    private String clientSecret;
    @Value("${application.paypal.mode}")
    private String mode;

    private final Logger log = LoggerFactory.getLogger(PaypalService.class);

    public ReturnPaymentDTO createPayment(String sum, String login) {
        ReturnPaymentDTO returnPaymentDTO = new ReturnPaymentDTO();
        Amount amount = new Amount();
        amount.setCurrency("USD");
        amount.setTotal(sum);
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");

        Payment payment = new Payment();
        payment.setIntent("sale");
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl("http://localhost:9000/#/cancel");
        redirectUrls.setReturnUrl("http://localhost:9000/#/register");
        payment.setRedirectUrls(redirectUrls);
        Payment createdPayment;
        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            createdPayment = payment.create(context);
            if (createdPayment != null) {
                Optional<String> redirectUrl = createdPayment.getLinks().stream()
                    .filter(links -> links.getRel().equalsIgnoreCase("approval_url"))
                    .map(Links::getHref).findFirst();

                if (redirectUrl.isPresent()) {
                    returnPaymentDTO.setStatus("success");
                    returnPaymentDTO.setReturnUrl(redirectUrl.get());
                    returnPaymentDTO.setId(createdPayment.getId());
                } else {
                    returnPaymentDTO.setStatus("failure");
                    log.error("No redirect url present in the paypal response id paypal : {}", createdPayment.getId());
                }
            }
        } catch (PayPalRESTException e) {
            log.error("Error when initiating paypal payment, login : {}", login, e);
        }
        return returnPaymentDTO;
    }

    public Optional<ReturnPaymentDTO> completePaymentWorkflow(CompletePaymentDTO completePaymentDTO) {
        ReturnPaymentDTO returnPaymentDTO = new ReturnPaymentDTO();
        Payment payment = new Payment();
        payment.setId(completePaymentDTO.getPaymentId());

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(completePaymentDTO.getPayerId());
        try {
            APIContext context = new APIContext(clientId, clientSecret, "sandbox");
            Payment createdPayment = payment.execute(context, paymentExecution);
            if (createdPayment != null) {
                returnPaymentDTO.setStatus("success");
                returnPaymentDTO.setId(createdPayment.getId());
            }
        } catch (PayPalRESTException e) {
            log.error("Error when completing paypal payment, payerId : {}", completePaymentDTO.getPayerId(), e);
            return Optional.empty();
        }
        return Optional.of(returnPaymentDTO);
    }

}

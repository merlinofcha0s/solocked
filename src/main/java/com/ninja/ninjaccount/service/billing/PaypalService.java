package com.ninja.ninjaccount.service.billing;

import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.service.billing.dto.CompletePaymentDTO;
import com.ninja.ninjaccount.service.billing.dto.ReturnPaymentDTO;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
    @Value("${application.paypal.id-year-plan}")
    private String idYearPlan;
    @Value("${application.paypal.id-month-plan}")
    private String idMonthPlan;

    @Value("${application.base.url}")
    private String url;
    @Value("${server.ssl.key-store:null}")
    private String keystore;
    @Value("${server.port}")
    private String port;

    private final Logger log = LoggerFactory.getLogger(PaypalService.class);

    public ReturnPaymentDTO createOneTimePayment(PlanType planType, String login) {
        ReturnPaymentDTO returnPaymentDTO = new ReturnPaymentDTO();
        Amount amount = new Amount();
        amount.setCurrency("USD");
        amount.setTotal(planType.getPrice().toString());

        Item item = new Item();
        item.setName(planType.name());
        item.setCurrency("USD");
        item.setPrice(planType.getPrice().toString());
        item.setQuantity("1");

        List<Item> items = new ArrayList<>();
        items.add(item);

        ItemList itemList = new ItemList();
        itemList.setItems(items);

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setItemList(itemList);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");

        Payment payment = new Payment();
        payment.setIntent("sale");
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        StringBuilder urlBuilder = new StringBuilder();

        String protocol = "http";
        if (keystore != null && !keystore.equals("null")) {
            protocol = "https";
        }

        urlBuilder.append(protocol).append("://").append(url);
        if (!port.equals("80") && !port.equals("443")) {
            urlBuilder.append(":").append(port);
        }

        redirectUrls.setCancelUrl(urlBuilder.toString() + "/#/cancel");
        redirectUrls.setReturnUrl(urlBuilder.toString() + "/#/register");
        payment.setRedirectUrls(redirectUrls);
        Payment createdPayment;
        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            createdPayment = payment.create(context);
            if (createdPayment != null) {
                returnPaymentDTO = handlePaypalResponse(returnPaymentDTO, createdPayment.getId(), createdPayment.getLinks(), true);
            }
        } catch (PayPalRESTException e) {
            log.error("Error when initiating paypal payment, login : {}", login, e);
            returnPaymentDTO.setStatus("failure");
        }
        return returnPaymentDTO;
    }

    private ReturnPaymentDTO handlePaypalResponse(ReturnPaymentDTO returnPaymentDTO, String paymentId, List<Links> paypalReturnLinks, boolean recurring) {
        Optional<String> redirectUrl = paypalReturnLinks.stream()
            .filter(links -> links.getRel().equalsIgnoreCase("approval_url"))
            .map(Links::getHref).findFirst();

        if (redirectUrl.isPresent()) {
            returnPaymentDTO.setStatus("success");
            returnPaymentDTO.setReturnUrl(redirectUrl.get());
            if (recurring) {

            } else {
                returnPaymentDTO.setPaymentId(paymentId);
            }

        } else {
            returnPaymentDTO.setStatus("failure");
            log.error("No redirect url present in the paypal response id paypal : {}", paymentId);
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
            APIContext context = new APIContext(clientId, clientSecret, mode);
            Payment createdPayment = payment.execute(context, paymentExecution);
            if (createdPayment != null && createdPayment.getState().equals("approved")) {
                returnPaymentDTO.setStatus("success");
                returnPaymentDTO.setPaymentId(createdPayment.getId());
                Optional<Transaction> transactionForExtractPlanType = createdPayment.getTransactions().stream().findFirst();
                Optional<List<Item>> itemsFromTransaction = transactionForExtractPlanType.map(transaction -> transaction.getItemList().getItems());
                Optional<Item> item = itemsFromTransaction.flatMap(items -> items.stream().findFirst());
                item.ifPresent(item1 -> returnPaymentDTO.setPlanType(PlanType.valueOf(item1.getName())));
            } else {
                returnPaymentDTO.setStatus("failure");
            }
        } catch (PayPalRESTException e) {
            log.error("Error when completing paypal payment, payerId : {} reason : {}", completePaymentDTO.getPayerId(), e.getDetails().getMessage(), e);
            return Optional.empty();
        }
        return Optional.of(returnPaymentDTO);
    }

    public ReturnPaymentDTO createRecurringPayment(PlanType planType, String login) {
        ReturnPaymentDTO returnPaymentDTO = new ReturnPaymentDTO();

        Agreement agreement = new Agreement();
        agreement.setName("Yearly Solocked agreement");
        agreement.setDescription("Yearly Solocked agreement");

        Instant instant = Instant.now().plus(25, ChronoUnit.HOURS).truncatedTo(ChronoUnit.MINUTES);

        agreement.setStartDate(instant.toString());

        // Set plan ID
        Plan plan = new Plan();
        switch (planType) {
            case PREMIUMYEAR:
                plan.setId(idYearPlan);
                break;
            case PREMIUMMONTH:
                plan.setId(idMonthPlan);
                break;
        }
        agreement.setPlan(plan);

        // Add payer details
        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");
        agreement.setPayer(payer);

        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            agreement = agreement.create(context);
            returnPaymentDTO = handlePaypalResponse(returnPaymentDTO, agreement.getToken(), agreement.getLinks(), true);
        } catch (UnsupportedEncodingException | PayPalRESTException | MalformedURLException e) {
            log.error("Error when initiating paypal payment, login : {}", login, e);
            returnPaymentDTO.setStatus("failure");
        }

        return returnPaymentDTO;
    }

}

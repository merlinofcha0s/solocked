package com.ninja.ninjaccount.service.billing;

import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.service.billing.dto.CompletePaymentDTO;
import com.ninja.ninjaccount.service.billing.dto.PaypalStatus;
import com.ninja.ninjaccount.service.billing.dto.ReturnPaymentDTO;
import com.paypal.api.payments.*;
import com.paypal.api.payments.Currency;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class PaypalService {

    @Value("${application.paypal.client-id}")
    private String clientId;
    @Value("${application.paypal.client-secret}")
    private String clientSecret;
    @Value("${application.paypal.mode}")
    private String mode;

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

        StringBuilder urlBuilder = getCurrentUrl();

        redirectUrls.setCancelUrl(urlBuilder.toString() + "/#/register");
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
            returnPaymentDTO.setStatus(PaypalStatus.FAILURE.getName());
        }
        return returnPaymentDTO;
    }

    private StringBuilder getCurrentUrl() {
        StringBuilder urlBuilder = new StringBuilder();
        String protocol = "http";
        if (keystore != null && !keystore.equals("null")) {
            protocol = "https";
        }

        urlBuilder.append(protocol).append("://").append(url);
        if (!port.equals("80") && !port.equals("443")) {
            urlBuilder.append(":").append(port);
        }

        return urlBuilder;
    }

    private ReturnPaymentDTO handlePaypalResponse(ReturnPaymentDTO returnPaymentDTO, String paymentId, List<Links> paypalReturnLinks, boolean recurring) {
        Optional<String> redirectUrl = paypalReturnLinks.stream()
            .filter(links -> links.getRel().equalsIgnoreCase("approval_url"))
            .map(Links::getHref).findFirst();

        if (redirectUrl.isPresent()) {
            returnPaymentDTO.setStatus(PaypalStatus.SUCCESS.getName());
            returnPaymentDTO.setReturnUrl(redirectUrl.get());
            returnPaymentDTO.setRecurring(recurring);
            returnPaymentDTO.setPaymentId(paymentId);
        } else {
            returnPaymentDTO.setStatus(PaypalStatus.FAILURE.getName());
            log.error("No redirect url present in the paypal response id paypal : {}", paymentId);
        }

        return returnPaymentDTO;
    }

    public Optional<ReturnPaymentDTO> completeOneTimePaymentWorkflow(CompletePaymentDTO completePaymentDTO) {
        ReturnPaymentDTO returnPaymentDTO = new ReturnPaymentDTO();
        Payment payment = new Payment();
        payment.setId(completePaymentDTO.getPaymentId());

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(completePaymentDTO.getPayerId());
        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            Payment createdPayment = payment.execute(context, paymentExecution);
            if (createdPayment != null && createdPayment.getState().equals("approved")) {
                returnPaymentDTO.setStatus(PaypalStatus.SUCCESS.getName());
                returnPaymentDTO.setPaymentId(createdPayment.getId());
                Optional<Transaction> transactionForExtractPlanType = createdPayment.getTransactions().stream().findFirst();
                Optional<List<Item>> itemsFromTransaction = transactionForExtractPlanType.map(transaction -> transaction.getItemList().getItems());
                Optional<Item> item = itemsFromTransaction.flatMap(items -> items.stream().findFirst());
                item.ifPresent(item1 -> returnPaymentDTO.setPlanType(PlanType.valueOf(item1.getName())));
            } else {
                returnPaymentDTO.setStatus(PaypalStatus.FAILURE.getName());
            }
        } catch (PayPalRESTException e) {
            log.error("Error when completing paypal payment, payerId : {} reason : {}", completePaymentDTO.getPayerId(), e.getDetails().getMessage(), e);
            return Optional.empty();
        }
        return Optional.of(returnPaymentDTO);
    }

    public ReturnPaymentDTO createRecurringPayment(PlanType planType, String login, LocalDate startDate, Boolean billImmediately) {
        ReturnPaymentDTO returnPaymentDTO = new ReturnPaymentDTO();

        Plan plan = createBillingPlan(planType, billImmediately);

        returnPaymentDTO = activateRecurringPlan(plan, returnPaymentDTO, login);
        returnPaymentDTO = activateAgreement(planType, login, returnPaymentDTO, startDate);

        return returnPaymentDTO;
    }

    private Plan createBillingPlan(PlanType planType, boolean billImmediately) {
        Plan plan = new Plan();
        plan.setName(planType.name());
        plan.setDescription(planType.getPlanDescription());
        plan.setType("INFINITE");

        // Payment_definitions
        PaymentDefinition paymentDefinition = new PaymentDefinition();
        paymentDefinition.setName("Regular Payments");
        paymentDefinition.setType("REGULAR");

        if (planType.getUnit().equals(ChronoUnit.YEARS)) {
            paymentDefinition.setFrequency("YEAR");
        } else {
            paymentDefinition.setFrequency("MONTH");
        }

        paymentDefinition.setFrequencyInterval(planType.getFrequency());
        // Cycle 0 = Infinity
        paymentDefinition.setCycles("0");
        // Currency
        Currency currency = new Currency();
        currency.setCurrency("USD");
        currency.setValue(planType.getPrice().toString());
        paymentDefinition.setAmount(currency);

        // Merchant_preferences
        MerchantPreferences merchantPreferences = new MerchantPreferences();

        if (billImmediately) {
            merchantPreferences.setSetupFee(currency);
        }

        // Payment_definition
        List<PaymentDefinition> paymentDefinitionList = new ArrayList<>();
        paymentDefinitionList.add(paymentDefinition);
        plan.setPaymentDefinitions(paymentDefinitionList);


        StringBuilder currentURL = getCurrentUrl();

        merchantPreferences.setCancelUrl(currentURL.toString() + "/#/paymenterrorbilling");
        merchantPreferences.setReturnUrl(currentURL.toString() + "/#/billing");
        merchantPreferences.setMaxFailAttempts("5");
        merchantPreferences.setAutoBillAmount("YES");
        merchantPreferences.setInitialFailAmountAction("CONTINUE");
        plan.setMerchantPreferences(merchantPreferences);
        return plan;
    }

    private ReturnPaymentDTO activateRecurringPlan(Plan plan, ReturnPaymentDTO returnPaymentDTO, String login) {
        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            // Create payment
            Plan createdPlan = plan.create(context);

            // Set up plan activate PATCH request
            List<Patch> patchRequestList = new ArrayList<>();
            Map<String, String> value = new HashMap<>();
            value.put("state", "ACTIVE");

            // Create update object to activate plan
            Patch patch = new Patch();
            patch.setPath("/");
            patch.setValue(value);
            patch.setOp("replace");
            patchRequestList.add(patch);

            // Activate plan
            createdPlan.update(context, patchRequestList);
            returnPaymentDTO.setStatus(PaypalStatus.SUCCESS.getName());
            returnPaymentDTO.setBillingPlanId(createdPlan.getId());
        } catch (PayPalRESTException e) {
            log.error("Error when initiating paypal payment, login : {}", login, e);
            returnPaymentDTO.setStatus(PaypalStatus.FAILURE.getName());
        }

        return returnPaymentDTO;
    }

    private ReturnPaymentDTO activateAgreement(PlanType planType, String login, ReturnPaymentDTO returnPaymentDTO, LocalDate startDate) {
        Agreement agreement = new Agreement();
        agreement.setName(planType.getPlanDescription() + " Agreement");
        agreement.setDescription(planType.name());

        Instant instant = startDate.atStartOfDay().toInstant(ZoneOffset.UTC).truncatedTo(ChronoUnit.MINUTES);

        agreement.setStartDate(instant.toString());

        // Set plan ID
        Plan plan = new Plan();
        plan.setId(returnPaymentDTO.getBillingPlanId());
        agreement.setPlan(plan);

        // Add payer details
        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");
        agreement.setPayer(payer);

        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            agreement = agreement.create(context);
            returnPaymentDTO = handlePaypalResponse(returnPaymentDTO, agreement.getId(), agreement.getLinks(), true);
            returnPaymentDTO.setTokenForRecurring(agreement.getToken());
            returnPaymentDTO.setBillingPlanId(plan.getId());
        } catch (UnsupportedEncodingException | PayPalRESTException | MalformedURLException e) {
            log.error("Error when initiating paypal payment, login : {}", login, e);
            returnPaymentDTO.setStatus(PaypalStatus.FAILURE.getName());
        }
        return returnPaymentDTO;
    }

    public ReturnPaymentDTO completeRecurringPaymentWorkflow(String token, String login) {
        ReturnPaymentDTO returnPaymentDTO = new ReturnPaymentDTO();
        returnPaymentDTO.setRecurring(true);

        Agreement agreement = new Agreement();
        agreement.setToken(token);

        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            Agreement activeAgreement = Agreement.execute(context, agreement.getToken());
            if (activeAgreement != null && activeAgreement.getState().equals("Active")) {
                returnPaymentDTO.setStatus(PaypalStatus.SUCCESS.getName());
                returnPaymentDTO.setPaymentId(activeAgreement.getId());
                returnPaymentDTO.setPlanType(PlanType.valueOf(activeAgreement.getDescription()));
            } else if (activeAgreement != null && activeAgreement.getState().equals("pending")) {
                returnPaymentDTO.setStatus(PaypalStatus.PAYMENT_PENDING.getName());
            } else {
                returnPaymentDTO.setStatus(PaypalStatus.FAILURE.getName());
            }
        } catch (PayPalRESTException e) {
            log.error("Error when initiating paypal payment, login : {}", login, e);
            returnPaymentDTO.setStatus(PaypalStatus.FAILURE.getName());
        }

        return returnPaymentDTO;
    }

    public ReturnPaymentDTO cancelRecurringPayment(String agreementId, String login) {
        ReturnPaymentDTO returnPaymentDTO = new ReturnPaymentDTO();

        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);

            AgreementStateDescriptor agreementStateDescriptor = new AgreementStateDescriptor();
            agreementStateDescriptor.setNote(new StringBuilder("User cancelation : ").append(login).toString());

            Agreement agreementToCancel = new Agreement();
            agreementToCancel.setId(agreementId);
            agreementToCancel.cancel(context, agreementStateDescriptor);

            returnPaymentDTO.setStatus(PaypalStatus.SUCCESS.getName());
        } catch (PayPalRESTException e) {
            log.error("Error when initiating paypal payment, login : {}", login, e);
            returnPaymentDTO.setStatus(PaypalStatus.FAILURE.getName());
        }

        return returnPaymentDTO;
    }

    public PaypalStatus checkAgreementStillActive(String agreementId) {
        PaypalStatus actualStatus = null;
        ;
        APIContext context = new APIContext(clientId, clientSecret, mode);
        try {
            Agreement agreement = Agreement.get(context, agreementId);
            switch (agreement.getState()) {
                case "Pending":
                    actualStatus = PaypalStatus.PAYMENT_PENDING;
                    break;
                case "Active":
                    actualStatus = PaypalStatus.ACTIVE;
                    break;
                case "Suspended":
                    actualStatus = PaypalStatus.SUSPENDED;
                    break;
                case "Cancelled":
                    actualStatus = PaypalStatus.CANCELED;
                    break;
                case "Expired":
                    actualStatus = PaypalStatus.EXPIRED;
                    break;
                default:
                    actualStatus = PaypalStatus.UNDEFINED;
            }
        } catch (PayPalRESTException e) {
            actualStatus = PaypalStatus.UNDEFINED;
            log.error("Error when checking agreement id, id : {}", agreementId, e);
        }

        return actualStatus;
    }

}

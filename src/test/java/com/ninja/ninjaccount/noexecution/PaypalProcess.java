package com.ninja.ninjaccount.noexecution;

import com.ninja.ninjaccount.NinjaccountApp;
import com.ninja.ninjaccount.service.billing.PaypalService;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = NinjaccountApp.class)
@Transactional
public class PaypalProcess {

    private final String clientId = "AfdfOU54rzJzWHXc9OVkkmimug8WYbPfL2SFNzsk6VxQQCbZZ5F10RoEXgO38mEJuf4zoZFifMepbAKi";
    private final String clientSecret = "EEtVyWCnKNziihhyuueonwWQ77_yNjMXz9xrUvic7Cu7YTaIrc6BtpLHqHCdMsfAa4Q3iOlqOJg8yNye";
    private final String mode = "sandbox";

    @Autowired
    private PaypalService paypalService;


    @Test
    public void createNewYearBillingPlan() {
        Plan plan = new Plan();
        plan.setName("Premium year local");
        plan.setDescription("Yearly billed solocked payment local v2");
        plan.setType("INFINITE");

        // Payment_definitions
        PaymentDefinition paymentDefinition = new PaymentDefinition();
        paymentDefinition.setName("Regular Payments");
        paymentDefinition.setType("REGULAR");
        paymentDefinition.setFrequency("YEAR");
        paymentDefinition.setFrequencyInterval("1");
        // Cycle 0 = Infinity
        paymentDefinition.setCycles("0");

        // Currency
        Currency currency = new Currency();
        currency.setCurrency("USD");
        currency.setValue("20");
        paymentDefinition.setAmount(currency);

        // Charge_models
        ChargeModels chargeModels = new com.paypal.api.payments.ChargeModels();
        chargeModels.setType("SHIPPING");
        chargeModels.setAmount(currency);
        List<ChargeModels> chargeModelsList = new ArrayList<>();
        chargeModelsList.add(chargeModels);
        paymentDefinition.setChargeModels(chargeModelsList);

        // Payment_definition
        List<PaymentDefinition> paymentDefinitionList = new ArrayList<>();
        paymentDefinitionList.add(paymentDefinition);
        plan.setPaymentDefinitions(paymentDefinitionList);

        // Merchant_preferences
        MerchantPreferences merchantPreferences = new MerchantPreferences();
        merchantPreferences.setSetupFee(currency);
        merchantPreferences.setCancelUrl("http://localhost:8080/#/billing/cancel");
        merchantPreferences.setReturnUrl("http://localhost:8080/#/billing");
        merchantPreferences.setMaxFailAttempts("0");
        merchantPreferences.setAutoBillAmount("YES");
        merchantPreferences.setInitialFailAmountAction("CONTINUE");
        plan.setMerchantPreferences(merchantPreferences);

        activatePlan(plan);
    }

    @Test
    public void createNewMonthBillingPlan() {
        Plan plan = new Plan();
        plan.setName("Premium month v2");
        plan.setDescription("Monthly billed solocked payment local v2");
        plan.setType("INFINITE");

        // Payment_definitions
        PaymentDefinition paymentDefinition = new PaymentDefinition();
        paymentDefinition.setName("Regular Payments");
        paymentDefinition.setType("REGULAR");
        paymentDefinition.setFrequency("MONTH");
        paymentDefinition.setFrequencyInterval("12");
        // Cycle 0 = Infinity
        paymentDefinition.setCycles("0");

        // Currency
        Currency currency = new Currency();
        currency.setCurrency("USD");
        currency.setValue("2");
        paymentDefinition.setAmount(currency);

        // Charge_models
        ChargeModels chargeModels = new com.paypal.api.payments.ChargeModels();
        chargeModels.setType("SHIPPING");
        chargeModels.setAmount(currency);
        List<ChargeModels> chargeModelsList = new ArrayList<>();
        chargeModelsList.add(chargeModels);
        paymentDefinition.setChargeModels(chargeModelsList);

        // Payment_definition
        List<PaymentDefinition> paymentDefinitionList = new ArrayList<>();
        paymentDefinitionList.add(paymentDefinition);
        plan.setPaymentDefinitions(paymentDefinitionList);

        // Merchant_preferences
        MerchantPreferences merchantPreferences = new MerchantPreferences();
        merchantPreferences.setSetupFee(currency);
        merchantPreferences.setCancelUrl("http://localhost:8080/#/billing/cancel");
        merchantPreferences.setReturnUrl("http://localhost:8080/#/billing");
        merchantPreferences.setMaxFailAttempts("0");
        merchantPreferences.setAutoBillAmount("YES");
        merchantPreferences.setInitialFailAmountAction("CONTINUE");
        plan.setMerchantPreferences(merchantPreferences);

        activatePlan(plan);
    }

    @Test
    public void listAllActivePlan() throws PayPalRESTException {
        APIContext context = new APIContext(clientId, clientSecret, mode);

        Map<String, String> params = new HashMap<>();
        params.put("status", "ACTIVE");
        params.put("page_size", "20");
        params.put("total_required", "yes");
        params.put("total_required", "yes");

        PlanList plans =  Plan.list(context, params);
        System.out.println(plans.toJSON());
    }

    @Test
    public void updatePlan() throws PayPalRESTException {

        APIContext context = new APIContext(clientId, clientSecret, mode);

        Plan plan =  Plan.get(context, "P-74K781695E173574X7DQILSI");
        System.out.println(plan.toJSON());

        List<Patch> patchRequestList = new ArrayList<>();
        Map<String, String> value = new HashMap<>();
//        value.put("cancel_url", "http://localhost:8080/#/billing/cancel");
//        value.put("return-url", "http://localhost:8080/#/billing/");
        value.put("status", "INACTIVE");
//        value.put("name", "Premium month");
//        value.put("description", "Month billed solocked payment");

        Patch patch = new Patch();
        patch.setPath("/merchant_preferences");
        patch.setValue(value);
        patch.setOp("replace");
        patchRequestList.add(patch);

        // Activate plan
        plan.update(context, patchRequestList);
    }

    private void activatePlan(Plan plan){
        try {
            APIContext context = new APIContext(clientId, clientSecret, mode);
            // Create payment
            Plan createdPlan = plan.create(context);
            System.out.println("Created plan with id = " + createdPlan.getId());
            System.out.println("Plan state = " + createdPlan.getState());

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
            System.out.println("Plan state = " + createdPlan.getState());
        } catch (PayPalRESTException e) {
            System.err.println(e.getDetails());
        }
    }



}

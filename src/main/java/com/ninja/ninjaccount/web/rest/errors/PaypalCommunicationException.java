package com.ninja.ninjaccount.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class PaypalCommunicationException extends AbstractThrowableProblem {

    public PaypalCommunicationException() {
        super(ErrorConstants.PAYPAL_COMMUNICATION_PROBLEM, "Problem when communicating with paypal", Status.SERVICE_UNAVAILABLE);
    }
}

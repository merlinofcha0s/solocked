package com.ninja.ninjaccount.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class CantUpdateDBCausePaymentException extends AbstractThrowableProblem {

    public CantUpdateDBCausePaymentException() {
        super(ErrorConstants.NO_PAID_SUBSCRIPTION, "Problem with your subscription", Status.EXPECTATION_FAILED);
    }
}

package com.ninja.ninjaccount.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

import java.net.URI;

public class CompletePaymentException extends AbstractThrowableProblem {

    public CompletePaymentException(URI errorConstant, String title, Status status) {
        super(errorConstant, title, status);
    }
}

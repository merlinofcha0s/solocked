package com.ninja.ninjaccount.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class InvalidChecksumException extends AbstractThrowableProblem {

    public InvalidChecksumException() {
        super(ErrorConstants.PARAMETERIZED_TYPE, "Error checksum failed", Status.EXPECTATION_FAILED);
    }
}

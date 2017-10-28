package com.ninja.ninjaccount.service.exceptions;

import com.ninja.ninjaccount.web.rest.errors.CustomParameterizedException;

public class MaxAccountsException extends Exception {

    private Integer actual;
    private Integer max;

    public MaxAccountsException(Integer actual, Integer max) {
        this.actual = actual;
        this.max = max;
    }

    public Integer getMax() {
        return max;
    }

    public void setMax(Integer max) {
        this.max = max;
    }

    public Integer getActual() {
        return actual;
    }

    public void setActual(Integer actual) {
        this.actual = actual;
    }
}

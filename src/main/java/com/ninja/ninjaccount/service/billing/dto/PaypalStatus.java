package com.ninja.ninjaccount.service.billing.dto;

public enum PaypalStatus {
    SUCCESS("success"), FAILURE("failure"), PAYMENT_PENDING("pending");

    String name;

    PaypalStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setStatus(String name) {
        this.name = name;
    }
}

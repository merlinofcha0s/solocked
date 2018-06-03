package com.ninja.ninjaccount.service.billing.dto;

public class ReturnPaymentDTO {

    private String status;

    private String returnUrl;

    private String id;


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "ReturnPaymentDTO{" +
            "status='" + status + '\'' +
            ", returnUrl='" + returnUrl + '\'' +
            ", id='" + id + '\'' +
            '}';
    }
}

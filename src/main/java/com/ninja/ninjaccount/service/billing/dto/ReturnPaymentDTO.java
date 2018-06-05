package com.ninja.ninjaccount.service.billing.dto;

import com.ninja.ninjaccount.domain.enumeration.PlanType;

public class ReturnPaymentDTO {

    private String status;

    private String returnUrl;

    private String paymentId;

    private String payerId;

    private PlanType planType;

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

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public PlanType getPlanType() {
        return planType;
    }

    public void setPlanType(PlanType planType) {
        this.planType = planType;
    }

    public String getPayerId() {
        return payerId;
    }

    public void setPayerId(String payerId) {
        this.payerId = payerId;
    }

    @Override
    public String toString() {
        return "ReturnPaymentDTO{" +
            "status='" + status + '\'' +
            ", returnUrl='" + returnUrl + '\'' +
            ", id='" + paymentId + '\'' +
            '}';
    }
}

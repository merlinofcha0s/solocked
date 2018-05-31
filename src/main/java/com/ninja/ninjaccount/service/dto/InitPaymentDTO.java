package com.ninja.ninjaccount.service.dto;

import com.ninja.ninjaccount.domain.enumeration.PlanType;

import javax.validation.constraints.NotNull;

public class InitPaymentDTO {

    @NotNull
    private PlanType planType;
    @NotNull
    private String login;

    public PlanType getPlanType() {
        return planType;
    }

    public void setPlanType(PlanType planType) {
        this.planType = planType;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    @Override
    public String toString() {
        return "InitPaymentDTO{" +
            "planType=" + planType +
            ", login='" + login + '\'' +
            '}';
    }
}

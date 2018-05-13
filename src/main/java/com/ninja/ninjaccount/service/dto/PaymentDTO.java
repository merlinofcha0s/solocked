package com.ninja.ninjaccount.service.dto;


import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;
import com.ninja.ninjaccount.domain.enumeration.PlanType;

/**
 * A DTO for the Payment entity.
 */
public class PaymentDTO implements Serializable {

    private Long id;

    @NotNull
    private LocalDate subscriptionDate;

    @NotNull
    private Integer price;

    @NotNull
    private PlanType planType;

    @NotNull
    private Boolean paid;

    private Long userId;

    private String userLogin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getSubscriptionDate() {
        return subscriptionDate;
    }

    public void setSubscriptionDate(LocalDate subscriptionDate) {
        this.subscriptionDate = subscriptionDate;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public PlanType getPlanType() {
        return planType;
    }

    public void setPlanType(PlanType planType) {
        this.planType = planType;
    }

    public Boolean isPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        PaymentDTO paymentDTO = (PaymentDTO) o;
        if(paymentDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paymentDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaymentDTO{" +
            "id=" + getId() +
            ", subscriptionDate='" + getSubscriptionDate() + "'" +
            ", price=" + getPrice() +
            ", planType='" + getPlanType() + "'" +
            ", paid='" + isPaid() + "'" +
            "}";
    }
}

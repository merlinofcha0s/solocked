package com.ninja.ninjaccount.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import com.ninja.ninjaccount.domain.enumeration.PlanType;

/**
 * A Payment.
 */
@Entity
@Table(name = "payment")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "subscription_date", nullable = false)
    private LocalDate subscriptionDate;

    @NotNull
    @Column(name = "price", nullable = false)
    private Integer price;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false)
    private PlanType planType;

    @NotNull
    @Column(name = "paid", nullable = false)
    private Boolean paid;

    @Column(name = "valid_until")
    private LocalDate validUntil;

    @Column(name = "last_payment_id")
    private String lastPaymentId;

    @Column(name = "recurring")
    private Boolean recurring;

    @Column(name = "billing_plan_id")
    private String billingPlanId;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getSubscriptionDate() {
        return subscriptionDate;
    }

    public Payment subscriptionDate(LocalDate subscriptionDate) {
        this.subscriptionDate = subscriptionDate;
        return this;
    }

    public void setSubscriptionDate(LocalDate subscriptionDate) {
        this.subscriptionDate = subscriptionDate;
    }

    public Integer getPrice() {
        return price;
    }

    public Payment price(Integer price) {
        this.price = price;
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public PlanType getPlanType() {
        return planType;
    }

    public Payment planType(PlanType planType) {
        this.planType = planType;
        return this;
    }

    public void setPlanType(PlanType planType) {
        this.planType = planType;
    }

    public Boolean isPaid() {
        return paid;
    }

    public Payment paid(Boolean paid) {
        this.paid = paid;
        return this;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public Payment validUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
        return this;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public String getLastPaymentId() {
        return lastPaymentId;
    }

    public Payment lastPaymentId(String lastPaymentId) {
        this.lastPaymentId = lastPaymentId;
        return this;
    }

    public void setLastPaymentId(String lastPaymentId) {
        this.lastPaymentId = lastPaymentId;
    }

    public Boolean isRecurring() {
        return recurring;
    }

    public Payment recurring(Boolean recurring) {
        this.recurring = recurring;
        return this;
    }

    public void setRecurring(Boolean recurring) {
        this.recurring = recurring;
    }

    public String getBillingPlanId() {
        return billingPlanId;
    }

    public Payment billingPlanId(String billingPlanId) {
        this.billingPlanId = billingPlanId;
        return this;
    }

    public void setBillingPlanId(String billingPlanId) {
        this.billingPlanId = billingPlanId;
    }

    public User getUser() {
        return user;
    }

    public Payment user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Payment payment = (Payment) o;
        if (payment.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), payment.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Payment{" +
            "id=" + getId() +
            ", subscriptionDate='" + getSubscriptionDate() + "'" +
            ", price=" + getPrice() +
            ", planType='" + getPlanType() + "'" +
            ", paid='" + isPaid() + "'" +
            ", validUntil='" + getValidUntil() + "'" +
            ", lastPaymentId='" + getLastPaymentId() + "'" +
            ", recurring='" + isRecurring() + "'" +
            ", billingPlanId='" + getBillingPlanId() + "'" +
            "}";
    }
}

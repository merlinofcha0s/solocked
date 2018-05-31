package com.ninja.ninjaccount.domain.enumeration;

/**
 * The PlanType enumeration.
 */
public enum PlanType {
    FREE(0),  PREMIUMYEAR(20), PREMIUMMONTH(2), BETA(0);

    Integer price;

    PlanType(Integer price) {
        this.price = price;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}

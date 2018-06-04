package com.ninja.ninjaccount.domain.enumeration;

import java.time.temporal.ChronoUnit;

/**
 * The PlanType enumeration.
 */
public enum PlanType {
    FREE(0, 9999999, ChronoUnit.YEARS),
    PREMIUMYEAR(20, 1, ChronoUnit.YEARS),
    PREMIUMMONTH(2, 1, ChronoUnit.MONTHS);

    Integer price;

    Integer unitAmountValidity;

    ChronoUnit unit;

    PlanType(Integer price, Integer unitAmountValidity, ChronoUnit unit) {
        this.price = price;
        this.unitAmountValidity = unitAmountValidity;
        this.unit = unit;
    }

    public Integer getUnitAmountValidity() {
        return unitAmountValidity;
    }

    public void setUnitAmountValidity(Integer unitAmountValidity) {
        this.unitAmountValidity = unitAmountValidity;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }


    public ChronoUnit getUnit() {
        return unit;
    }

    public void setUnit(ChronoUnit unit) {
        this.unit = unit;
    }
}

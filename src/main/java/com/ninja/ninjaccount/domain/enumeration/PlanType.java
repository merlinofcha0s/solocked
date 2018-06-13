package com.ninja.ninjaccount.domain.enumeration;

import java.time.temporal.ChronoUnit;

/**
 * The PlanType enumeration.
 */
public enum PlanType {
    FREE(0, 9999999, ChronoUnit.YEARS, "", ""),
    PREMIUMYEAR(20, 1, ChronoUnit.YEARS,  "Yearly billed solocked payment", "1"),
    PREMIUMMONTH(2, 1, ChronoUnit.MONTHS, "Monthly billed solocked payment", "12");

    Integer price;

    Integer unitAmountValidity;

    ChronoUnit unit;


    String planDescription;

    String frequency;

    PlanType(Integer price, Integer unitAmountValidity, ChronoUnit unit,  String planDescription, String frequency) {
        this.price = price;
        this.unitAmountValidity = unitAmountValidity;
        this.unit = unit;
        this.planDescription = planDescription;
        this.frequency = frequency;
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

    public String getPlanDescription() {
        return planDescription;
    }

    public void setPlanDescription(String planDescription) {
        this.planDescription = planDescription;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }
}

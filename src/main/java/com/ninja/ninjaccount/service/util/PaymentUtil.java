package com.ninja.ninjaccount.service.util;

import com.ninja.ninjaccount.domain.enumeration.PlanType;

public final class PaymentUtil {

    private PaymentUtil() {
    }

    public static Integer getMaxAccountByPlanType(PlanType planType) {
        switch (planType) {
            case PREMIUMMONTH:
            case PREMIUMYEAR:
                return PaymentConstant.MAX_ACCOUNTS_PREMIUM;
            case FREE:
                return PaymentConstant.MAX_ACCOUNTS_FREE;
            default:
                return -1;
        }
    }
}

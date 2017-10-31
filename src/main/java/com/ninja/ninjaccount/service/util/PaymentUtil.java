package com.ninja.ninjaccount.service.util;

import com.ninja.ninjaccount.domain.enumeration.PlanType;
import com.ninja.ninjaccount.service.dto.PaymentConstant;

public final class PaymentUtil {

    public PaymentUtil() {
    }

    public static Integer getMaxAccountByPlanType(PlanType planType) {
        switch (planType) {
            case PREMIUM:
                return PaymentConstant.MAX_ACCOUNTS_PREMIUM;
            case FREE:
                return PaymentConstant.MAX_ACCOUNTS_FREE;
            case BETA:
                return PaymentConstant.MAX_ACCOUNTS_BETA;
            default:
                return -1;
        }
    }
}

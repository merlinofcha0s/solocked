import { BaseEntity } from './../../shared';

export enum PlanType {
    FREE = 'FREE',
    PREMIUMMONTH = 'PREMIUMMONTH',
    PREMIUMYEAR = 'PREMIUMYEAR',
    UNKNOWN = 'UNKNOWN'
}

export const enum MaxAccountPlanType {
    MAX_ACCOUNTS_PREMIUM = 1000,
    MAX_ACCOUNTS_FREE = 10
}

export class Payment implements BaseEntity {
    constructor(
        public id?: number,
        public subscriptionDate?: any,
        public price?: number,
        public planType?: PlanType,
        public paid?: boolean,
        public validUntil?: any,
        public lastPaymentId?: string,
        public recurring?: boolean,
        public billingPlanId?: string,
        public tokenRecurring?: string,
        public userLogin?: string,
        public userId?: number,
    ) {
        this.paid = false;
        this.recurring = false;
    }
}

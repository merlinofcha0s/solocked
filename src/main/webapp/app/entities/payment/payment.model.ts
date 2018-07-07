import { BaseEntity } from './../../shared';

export const enum PlanType {
    'FREE',
    ' PREMIUMYEAR',
    ' PREMIUMMONTH'
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

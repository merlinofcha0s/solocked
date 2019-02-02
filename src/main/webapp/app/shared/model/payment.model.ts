import { Moment } from 'moment';

export const enum PlanType {
    FREE = 'FREE',
    PREMIUMYEAR = ' PREMIUMYEAR',
    PREMIUMMONTH = ' PREMIUMMONTH'
}

export interface IPayment {
    id?: number;
    subscriptionDate?: Moment;
    price?: number;
    planType?: PlanType;
    paid?: boolean;
    validUntil?: Moment;
    lastPaymentId?: string;
    recurring?: boolean;
    billingPlanId?: string;
    tokenRecurring?: string;
    userLogin?: string;
    userId?: number;
}

export class Payment implements IPayment {
    constructor(
        public id?: number,
        public subscriptionDate?: Moment,
        public price?: number,
        public planType?: PlanType,
        public paid?: boolean,
        public validUntil?: Moment,
        public lastPaymentId?: string,
        public recurring?: boolean,
        public billingPlanId?: string,
        public tokenRecurring?: string,
        public userLogin?: string,
        public userId?: number
    ) {
        this.paid = this.paid || false;
        this.recurring = this.recurring || false;
    }
}

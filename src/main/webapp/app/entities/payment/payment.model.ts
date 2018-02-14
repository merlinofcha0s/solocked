import {BaseEntity} from '../../shared';

export const enum PlanType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM',
    BETA = 'BETA'
}

export class Payment implements BaseEntity {
    constructor(
        public id?: number,
        public subscriptionDate?: any,
        public price?: number,
        public planType?: PlanType,
        public paid?: boolean,
        public userId?: number,
    ) {
        this.paid = false;
    }
}

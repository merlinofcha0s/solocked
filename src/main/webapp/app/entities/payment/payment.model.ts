import { BaseEntity } from './../../shared';

const enum PlanType {
    'FREE',
    ' PREMIUM'
}

export class Payment implements BaseEntity {
    constructor(
        public id?: number,
        public subscriptionDate?: any,
        public price?: number,
        public planType?: PlanType,
        public userId?: number,
    ) {
    }
}

import {PlanType} from '../../../entities/payment/payment.model';

export class InitPayment {
    constructor(
        public planType: PlanType,
        public login?: string
    ) {
    }
}

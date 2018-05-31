import {PlanType} from '../../../entities/payment';

export class InitPayment {
    constructor(
        public planType: PlanType,
        public login: string
    ) {
    }
}

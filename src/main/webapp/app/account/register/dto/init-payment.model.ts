import { PlanType } from 'app/shared/model/payment.model';

export class InitPayment {
    constructor(public planType: PlanType, public login?: string) {}
}

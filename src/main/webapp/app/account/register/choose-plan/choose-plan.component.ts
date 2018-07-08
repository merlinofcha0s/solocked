import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Payment, PlanType } from 'app/shared/model/payment.model';

@Component({
    selector: 'jhi-choose-plan',
    templateUrl: './choose-plan.component.html',
    styleUrls: ['./choose-plan.component.scss']
})
export class ChoosePlanComponent implements OnInit, OnChanges {
    @Input() actualPayment: Payment;
    @Input() modeBilling: boolean;
    @Output() planChoosed = new EventEmitter<PlanType>();

    free: boolean;
    premiumY: boolean;
    premiumM: boolean;

    PlanType: typeof PlanType = PlanType;

    constructor() {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.actualPayment !== undefined) {
            this.onChoosePlan(this.actualPayment.planType);
        }
    }

    onChoosePlan(planType: PlanType) {
        switch (planType) {
            case PlanType.FREE:
                this.free = true;
                this.premiumM = false;
                this.premiumY = false;
                break;
            case PlanType.PREMIUMYEAR:
                this.free = false;
                this.premiumM = false;
                this.premiumY = true;
                break;
            case PlanType.PREMIUMMONTH:
                this.free = false;
                this.premiumM = true;
                this.premiumY = false;
                break;
        }
        this.planChoosed.emit(planType);
    }
}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlanType} from '../../../entities/payment';

@Component({
    selector: 'jhi-choose-plan',
    templateUrl: './choose-plan.component.html',
    styleUrls: ['./choose-plan.component.scss']
})
export class ChoosePlanComponent implements OnInit {

    @Output() planChoosed = new EventEmitter<PlanType>();

    free: boolean;
    premiumY: boolean;
    premiumM: boolean;

    PlanType: typeof PlanType = PlanType;

    constructor() {
    }

    ngOnInit() {
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

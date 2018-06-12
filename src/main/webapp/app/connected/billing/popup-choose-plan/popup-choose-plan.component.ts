import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Payment, PlanType} from '../../../entities/payment/payment.model';

@Component({
    selector: 'jhi-billing',
    templateUrl: './popup-choose-plan.component.html',
    styleUrls: ['./popup-choose-plan.component.scss']
})
export class PopupChoosePlanComponent implements OnInit, OnDestroy {

    currentPayment: Payment;
    loading: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
        this.currentPayment = this.data.currentPayment;
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    onChoosePlan(planType: PlanType) {
        if (this.currentPayment.planType !== planType) {
            this.loading = true;
        }
    }
}


import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Payment, PlanType} from '../../../entities/payment/payment.model';
import {PaymentService} from '../../../entities/payment/payment.service';
import {Principal} from '../../../shared';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'jhi-choose-plan-popup',
    templateUrl: './popup-choose-plan.component.html',
    styleUrls: ['./popup-choose-plan.component.scss']
})
export class PopupChoosePlanComponent implements OnInit, OnDestroy {

    currentPayment: Payment;
    loading: boolean;

    loadingMessage: string;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private paymentService: PaymentService,
                private principal: Principal,
                @Inject(DOCUMENT) private document: any) {
        this.currentPayment = this.data.currentPayment;
        this.loading = false;
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    onChoosePlan(planType: PlanType) {
        this.loadingMessage = 'billing.loadingchangeplan';
        this.loading = true;
        this.paymentService.initRecurringPaymentWorkflow(planType)
            .subscribe((response) => {
                this.loadingMessage = 'register.form.loadingpayment';
                this.document.location.href = response.body.returnUrl;
            });
    }
}

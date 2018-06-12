import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';
import {Payment} from '../../entities/payment/payment.model';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PopupChoosePlanComponent} from './popup-choose-plan/popup-choose-plan.component';

@Component({
    selector: 'jhi-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, OnDestroy {

    payment: Payment;
    paymentSub: Subscription;

    private customBlockDialog: MatDialogRef<PopupChoosePlanComponent>;

    constructor(private paymentService: PaymentService,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.paymentSub = this.paymentService.payment$.subscribe((payment) => {
            this.payment = payment;
        });
        this.paymentService.getPaymentByLogin();
    }

    ngOnDestroy(): void {
    }

    openChangePlan() {
        this.customBlockDialog = this.dialog.open(PopupChoosePlanComponent, {
            data: {currentPayment: this.payment},
        });
    }
}

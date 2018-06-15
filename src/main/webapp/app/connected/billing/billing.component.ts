import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';
import {Payment} from '../../entities/payment/payment.model';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PopupChoosePlanComponent} from './popup-choose-plan/popup-choose-plan.component';
import {isUndefined} from 'util';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {WaiterComponent} from '../../shared/waiter/waiter.component';
import {
    EMAIL_ALREADY_USED_TYPE,
    LOGIN_ALREADY_USED_TYPE,
    PAYMENT_PENDING,
    PAYPAL_COMMUNICATION_PROBLEM_TYPE
} from '../../shared';
import {SnackUtilService} from "../../shared/snack/snack-util.service";

@Component({
    selector: 'jhi-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, OnDestroy, AfterViewInit {

    payment: Payment;
    paymentSub: Subscription;

    modeFinalizingPayment: boolean;

    private customBlockDialog: MatDialogRef<PopupChoosePlanComponent>;
    private finalizingPaymentDialogRef: MatDialogRef<WaiterComponent>;
    private success: boolean;
    private error: string;

    constructor(private paymentService: PaymentService,
                private dialog: MatDialog,
                private route: ActivatedRoute,
                private snackUtil: SnackUtilService,) {
    }

    ngAfterViewInit() {
        this.completePayment();
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

    private completePayment() {
        const token = this.route.snapshot.queryParams['token'];
        if (token !== undefined) {
            this.modeFinalizingPayment = true;
            this.openWaiterFinalizer();
            this.completePaymentService(token);
        }
    }

    private completePaymentService(token) {
        this.paymentService.completeRecurringPaymentWorkflow(token)
            .subscribe((response) => {
                this.success = true;
                this.finalizingPaymentDialogRef.close();
                this.paymentService.getPaymentByLogin();
                this.snackUtil.openSnackBar('billing.success', 10000, 'fa-check-circle');
            }, (response: HttpErrorResponse) => this.processError(response));
    }

    private processError(response: HttpErrorResponse) {
        this.success = null;
        if (response.status === 503 && response.error.type === PAYPAL_COMMUNICATION_PROBLEM_TYPE) {
            this.error = 'billing.error.errorComunicationPaypal';
        } else if (response.status === 406 && response.error.type === PAYMENT_PENDING) {
            this.error = 'billing.error.errorPendingPayment';
        } else {
            this.error = 'billing.error.error';
        }
        this.finalizingPaymentDialogRef.close();
        this.snackUtil.openSnackBar(this.error, 60000, 'fa-times');
    }

    private openWaiterFinalizer() {
        this.finalizingPaymentDialogRef = this.dialog.open(WaiterComponent, {
            disableClose: true,
            data: {keyMessage: 'register.form.waitingcompletepayment'}
        });
    }
}

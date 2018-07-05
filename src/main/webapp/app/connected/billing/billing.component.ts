import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';
import {Payment, PlanType} from '../../entities/payment/payment.model';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PopupChoosePlanComponent} from './popup-choose-plan/popup-choose-plan.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {WaiterComponent} from '../../shared/waiter/waiter.component';
import {TranslateService} from '@ngx-translate/core';

import {
    PAYMENT_PENDING,
    PAYPAL_COMMUNICATION_PROBLEM_TYPE
} from '../../shared';
import {SnackUtilService} from '../../shared/snack/snack-util.service';
import {PopupCancelPlanComponent} from './popup-cancel-plan/popup-cancel-plan.component';

@Component({
    selector: 'jhi-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, OnDestroy, AfterViewInit {

    payment: Payment;
    paymentSub: Subscription;

    modeFinalizingPayment: boolean;

    private choosePlanDialog: MatDialogRef<PopupChoosePlanComponent>;
    private cancelPlanDialog: MatDialogRef<PopupCancelPlanComponent>;
    private finalizingPaymentDialogRef: MatDialogRef<WaiterComponent>;
    private success: boolean;
    private error: string;

    planTypeLabel: string;

    constructor(private paymentService: PaymentService,
                private dialog: MatDialog,
                private route: ActivatedRoute,
                private snackUtil: SnackUtilService,
                private translateService: TranslateService) {
    }

    ngAfterViewInit() {
        this.completePayment();
    }

    ngOnInit() {
        this.paymentSub = this.paymentService.payment$.subscribe((payment) => {
            this.payment = payment;

            let keyPlanType = '';
            if (this.payment.planType) {
                switch (this.payment.planType) {
                    case PlanType.FREE:
                        keyPlanType = 'billing.plantype.free';
                        break;
                    case PlanType.PREMIUMYEAR:
                        keyPlanType = 'billing.plantype.year';
                        break;
                    case PlanType.PREMIUMMONTH:
                        keyPlanType = 'billing.plantype.month';
                        break;
                    case PlanType.UNKNOWN:
                        keyPlanType = 'billing.plantype.unknown';
                        break;
                }
                this.translateService.get(keyPlanType).subscribe((label) => {
                    this.planTypeLabel = label;
                });
            }
        });
        this.paymentService.getPaymentByLogin();
    }

    ngOnDestroy(): void {
    }

    openChangePlan() {
        this.choosePlanDialog = this.dialog.open(PopupChoosePlanComponent, {
            disableClose: true,
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

    onCancelSubscription() {
        this.cancelPlanDialog = this.dialog.open(PopupCancelPlanComponent, {
            disableClose: true,
            data: {currentPayment: this.payment},
        });

        this.cancelPlanDialog.afterClosed().subscribe((result) => {
            if (result === 'success') {
                this.paymentService.getPaymentByLogin();
            }
        });
    }
}

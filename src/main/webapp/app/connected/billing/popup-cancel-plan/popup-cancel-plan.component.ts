import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ExportAllAccountsComponent } from '../../../account/settings/export-all-accounts/export-all-accounts.component';
import { PaymentService } from '../../../entities/payment/payment.service';
import { SnackUtilService } from '../../../shared/snack/snack-util.service';
import { PARAMETERIZED_TYPE, PAYMENT_PENDING, PAYPAL_COMMUNICATION_PROBLEM_TYPE } from '../../../shared';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ReturnPayment } from '../../../account/register/dto/return-payment.model';

@Component({
    selector: 'jhi-cancel-plan',
    templateUrl: './popup-cancel-plan.component.html',
    styleUrls: ['./popup-cancel-plan.component.scss']
})
export class PopupCancelPlanComponent implements OnInit, OnDestroy {
    loading: boolean;
    loadingMessage: string;

    constructor(
        private dialogRef: MatDialogRef<PopupCancelPlanComponent>,
        private paymentService: PaymentService,
        private snackUtil: SnackUtilService
    ) {
        this.loadingMessage = 'billing.cancelpopup.loadingcancel';
    }

    ngOnInit() {}

    ngOnDestroy(): void {}

    onCancel() {
        this.loading = true;
        this.paymentService.cancelRecurringPaymentWorkflow().subscribe(
            (response: HttpResponse<ReturnPayment>) => {
                this.loading = false;
                this.dialogRef.close('success');
                this.snackUtil.openSnackBar('billing.cancelpopup.cancelsuccess', 10000, 'check-circle');
            },
            (error: HttpErrorResponse) => this.processError(error)
        );
    }

    private processError(response: HttpErrorResponse) {
        let error = '';
        if (response.status === 400 && response.error.type === PARAMETERIZED_TYPE) {
            error = 'billing.cancelpopup.error.errorcancelpayment';
        } else {
            error = 'billing.cancelpopup.error.errorinternalcancelpayment';
        }

        this.dialogRef.close('error');
        this.snackUtil.openSnackBar(error, 30000, 'times');
    }
}

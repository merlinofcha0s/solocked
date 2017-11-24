import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {SnackComponent} from '../../../../shared/snack/snack.component'
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'jhi-delete-payment-line.component',
    templateUrl: './delete-payment-line.component.html'
})
export class DeletePaymentLineComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {
    }

    ngOnInit() {
    }

    onDelete() {
        const message = this.translateService.instant('ninjaccountApp.accountsDB.paymentblock.deletePopup.snack');
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.duration = 3000;
        config.data = {icon: 'fa-check-circle-o', text: message}
        this.snackBar.openFromComponent(SnackComponent, config);
    }

}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {SnackComponent} from '../../../../shared/snack/snack.component'
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'jhi-delete-payment-line.component',
    templateUrl: './delete-payment-line.component.html'
})
export class DeletePaymentLineComponent implements OnInit {

    title: string;
    snackMessage: string;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {
        this.title = this.data.title;
        this.snackMessage = this.data.snackMessage;
    }

    ngOnInit() {
    }

    onDelete() {
        const message = this.translateService.instant(this.snackMessage);
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.duration = 3000;
        config.data = {icon: 'fa-check-circle', text: message}
        this.snackBar.openFromComponent(SnackComponent, config);
    }

}

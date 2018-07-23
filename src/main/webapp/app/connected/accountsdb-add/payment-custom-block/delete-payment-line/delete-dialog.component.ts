import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SnackComponent } from '../../../../shared/snack/snack.component';
import { TranslateService } from '@ngx-translate/core';
import { SnackUtilService } from 'app/shared/snack/snack-util.service';

@Component({
    selector: 'jhi-delete-payment-line.component',
    templateUrl: './delete-dialog.component.html'
})
export class DeleteDialogComponent implements OnInit {
    title: string;
    snackMessage: string;
    datePayment: string;
    customFieldName: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private snackUtils: SnackUtilService
    ) {
        this.title = this.data.title;
        this.snackMessage = this.data.snackMessage;
        this.datePayment = this.data.date;
        this.customFieldName = this.data.customFieldName;
    }

    ngOnInit() {}

    onDelete() {
        this.snackUtils.openSnackBar(this.snackMessage, 3000, 'check-circle');
    }
}

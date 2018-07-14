import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountsDBService } from 'app/entities/accounts-db';
import { SnackUtilService } from 'app/shared/snack/snack-util.service';

@Component({
    selector: 'jhi-accountsdb-delete',
    templateUrl: './accountsdb-delete.component.html'
})
export class AccountsdbDeleteComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private router: Router,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private accountsService: AccountsDBService,
        private snackbarUtils: SnackUtilService
    ) {}

    ngOnInit() {}

    onDelete() {
        this.snackbarUtils.openSnackBar('ninjaccountApp.accountsDB.details.deletePopup.snack', 3000, 'check-circle');
        this.accountsService.deleteAccount(this.data.id);
        this.router.navigate(['/accounts']);
    }
}

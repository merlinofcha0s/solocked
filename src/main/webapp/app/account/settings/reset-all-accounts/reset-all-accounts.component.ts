import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountsService} from '../../../shared/account/accounts.service';
import {MatDialogRef} from '@angular/material';
import {SnackUtilService} from '../../../shared/snack/snack-util.service';

@Component({
    selector: 'jhi-reset-all-accounts',
    templateUrl: './reset-all-accounts.component.html',
    styleUrls: ['./reset-all-accounts.component.scss']
})
export class ResetAllAccountsComponent implements OnInit, OnDestroy {

    separator = '","';

    constructor(private accountsService: AccountsService,
                private dialogRef: MatDialogRef<ResetAllAccountsComponent>,
                private snackUtil: SnackUtilService) {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    onReset() {
        this.accountsService.resetEntireDB();
        this.dialogRef.close('reset over');
    }
}

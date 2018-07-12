import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AccountsDBService } from 'app/entities/accounts-db';

@Component({
    selector: 'jhi-reset-all-accounts',
    templateUrl: './reset-all-accounts.component.html',
    styleUrls: ['./reset-all-accounts.component.scss']
})
export class ResetAllAccountsComponent implements OnInit, OnDestroy {
    constructor(private accountsService: AccountsDBService, private dialogRef: MatDialogRef<ResetAllAccountsComponent>) {}

    ngOnInit() {}

    ngOnDestroy(): void {}

    onReset() {
        this.accountsService.resetEntireDB();
        this.dialogRef.close('success');
    }
}

import {Component, Inject, OnInit} from '@angular/core';
import {ExportAllAccountsComponent} from '../../account/settings/export-all-accounts/export-all-accounts.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'jhi-waiter',
    templateUrl: './waiter.component.html',
    styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<ExportAllAccountsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

    }

    ngOnInit(): void {
    }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {ExportAllAccountsComponent} from "../../../account/settings/export-all-accounts/export-all-accounts.component";

@Component({
    selector: 'jhi-cancel-plan',
    templateUrl: './popup-cancel-plan.component.html',
    styleUrls: ['./popup-cancel-plan.component.scss']
})
export class PopupCancelPlanComponent implements OnInit, OnDestroy {

    loading: boolean;
    loadingMessage: string;

    constructor(private dialogRef: MatDialogRef<PopupCancelPlanComponent>) {
    }

    ngOnInit() {
        this.loading = true;
        this.loadingMessage = 'billing.cancelpopup.loadingcancel';
    }

    ngOnDestroy(): void {
    }

    onCancel() {
        this.dialogRef.close('cancel over');
    }

}

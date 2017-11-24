import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'jhi-custom-block',
    templateUrl: './add-custom-block.component.html',
    styleUrls: ['./add-custom-block.component.scss']
})
export class AddCustomBlockComponent implements OnInit, OnDestroy {

    disablePaymentBlock: boolean;

    private blockToAdd: {
        paymentBlocks: boolean
    };

    constructor(private dialogRef: MatDialogRef<AddCustomBlockComponent>
        , @Inject(MAT_DIALOG_DATA) private data: any) {
        this.blockToAdd = {paymentBlocks: false};
        if (this.data.customBlockCounter.paymentBlocks.length >= 1) {
            this.disablePaymentBlock = true;
            this.blockToAdd.paymentBlocks = false;
        }
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {

    }

    onPaymentFieldSelected() {
        if (!this.disablePaymentBlock) {
            if (!this.blockToAdd.paymentBlocks) {
                this.blockToAdd.paymentBlocks = true;
            } else {
                this.blockToAdd.paymentBlocks = false;
            }
        }
    }

    validateChoice() {
        this.dialogRef.close(this.blockToAdd);
    }

    disableValidate(): boolean {
        return !this.blockToAdd.paymentBlocks;
    }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
    selector: 'jhi-custom-block',
    templateUrl: './add-custom-block.component.html',
    styleUrls: ['./add-custom-block.component.scss']
})
export class AddCustomBlockComponent implements OnInit, OnDestroy {

    private blockToAdd: {
        paymentBlocks: boolean
    };

    constructor(public dialogRef: MatDialogRef<AddCustomBlockComponent>) {
        this.blockToAdd = {paymentBlocks: false};
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {

    }

    onPaymentFieldSelected() {
        if (this.blockToAdd.paymentBlocks) {
            this.blockToAdd.paymentBlocks = false;
        } else {
            this.blockToAdd.paymentBlocks = true;
        }

    }

    validateChoice() {
        this.dialogRef.close(this.blockToAdd);
    }

    disableValidate(): boolean {
        return !this.blockToAdd.paymentBlocks;
    }


}

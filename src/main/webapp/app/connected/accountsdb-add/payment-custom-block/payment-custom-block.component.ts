import {Component, OnDestroy, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Payment} from '../../../shared/account/payment-block.model';
import {MatDatepicker} from "@angular/material";
import {isUndefined} from "util";

@Component({
    selector: 'jhi-payment-custom-block',
    templateUrl: './payment-custom-block.component.html',
    styleUrls: ['./payment-custom-block.component.scss']
})
export class PaymentCustomBlockComponent implements OnInit, OnDestroy {

    @ViewChild(MatDatepicker) picker;

    @Input() payments: Array<Payment>;

    @Output() onSyncPayments = new EventEmitter<Array<Payment>>();


    constructor() {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    onAddPayment() {
        const newPayment = new Payment(new Date(), 0, '', '', '');

        this.payments.push(newPayment);
        this.onSyncPayments.emit(this.payments);
    }

    onRemovePayment(index: number) {
        this.payments.splice(index, 1);
        this.onSyncPayments.emit(this.payments);
    }
}

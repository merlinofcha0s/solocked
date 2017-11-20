import {Component, OnDestroy, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import {Payment} from '../../../shared/account/payment-block.model';
import {MatDatepicker} from "@angular/material";
import {isUndefined} from "util";

export class DisplayValuesPayment {
    overDate: boolean;
    editDate: boolean;

    overAmount: boolean;
    editAmount: boolean;

    overMethod: boolean;
    editMethod: boolean;

    overCode: boolean;
    editCode: boolean;

    overNotes: boolean;
    editNotes: boolean;

    static placeholderValueMethod = 'My method';
    static placeholderValueCode = 'MYCODE';
    static placeholderValueNotes = 'My notes !';

    constructor() {
        this.overDate = false;
        this.editDate = false;
        this.overAmount = false;
        this.editAmount = false;
        this.overMethod = false;
        this.editMethod = false;
        this.overCode = false;
        this.editCode = false;
        this.overNotes = false;
        this.editNotes = false;
    }
}

@Component({
    selector: 'jhi-payment-custom-block',
    templateUrl: './payment-custom-block.component.html',
    styleUrls: ['./payment-custom-block.component.scss']
})
export class PaymentCustomBlockComponent implements OnInit, OnDestroy {

    @ViewChild(MatDatepicker) picker;

    payments: Array<Payment>;

    @Output() onSyncPayments = new EventEmitter<Array<Payment>>();

    displayPayments: Array<DisplayValuesPayment>;

    constructor() {
        this.payments = new Array<Payment>();
        this.displayPayments = new Array<DisplayValuesPayment>();
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    onAddPayment() {
        const newPayment = new Payment(new Date(), 0
            , DisplayValuesPayment.placeholderValueMethod, DisplayValuesPayment.placeholderValueCode, DisplayValuesPayment.placeholderValueNotes);
        const newDisplayPayment = new DisplayValuesPayment();

        this.displayPayments.push(newDisplayPayment);
        this.payments.push(newPayment);
        this.onSyncPayments.emit(this.payments);
    }

    onClickOutsideDatePicker(index: number) {
        if (isUndefined(this.picker) || !this.picker.opened) {
            this.displayPayments[index].editDate = false;
        }
    }

    onRemovePayment(index: number) {
        this.displayPayments.splice(index, 1);
        this.payments.splice(index, 1);
        this.onSyncPayments.emit(this.payments);
    }

    clearPlaceholderMethod(index: number) {
        if (this.payments[index].method === DisplayValuesPayment.placeholderValueMethod) {
            this.payments[index].method = '';
        }
    }

    clearPlaceholderCode(index: number) {
        if (this.payments[index].code === DisplayValuesPayment.placeholderValueCode) {
            this.payments[index].code = '';
        }
    }

    clearPlaceholderNotes(index: number) {
        if (this.payments[index].notes === DisplayValuesPayment.placeholderValueNotes) {
            this.payments[index].notes = '';
        }
    }

    createPlaceholderMethod(index: number) {
        if (this.payments[index].method === '') {
            this.payments[index].method = DisplayValuesPayment.placeholderValueMethod;
        }
    }

    createPlaceholderCode(index: number) {
        if (this.payments[index].code === '') {
            this.payments[index].code = DisplayValuesPayment.placeholderValueCode;
        }
    }

    createPlaceholderNotes(index: number) {
        if (this.payments[index].notes === '') {
            this.payments[index].notes = DisplayValuesPayment.placeholderValueNotes;
        }
    }

    createPlaceholderDate(index: number) {
        if (this.payments[index].date === null) {
            this.payments[index].date =  new Date();
        }
    }

    createPlaceholderAmount(index: number) {
        if (this.payments[index].amount === null) {
            this.payments[index].amount =  0;
        }
    }

    onClickOutSideAmount(event: any, index: number) {
        if (event && event['value'] === true) {
            this.displayPayments[index].editAmount = false;
            this.displayPayments[index].overAmount = false;
            this.createPlaceholderAmount(index);
        }
    }

    onClickOutSideDate(event: any, index: number) {
        if (event && event['value'] === true && (isUndefined(this.picker) || !this.picker.opened)) {
            this.displayPayments[index].editDate = false;
            this.displayPayments[index].overDate = false;
            this.createPlaceholderDate(index);
        }
    }

    onClickOutSideMethod(event: any, index: number) {
        if (event && event['value'] === true) {
            this.displayPayments[index].editMethod = false;
            this.displayPayments[index].overMethod = false;
            this.createPlaceholderMethod(index);
        }
    }

    onClickOutSideCode(event: any, index: number) {
        if (event && event['value'] === true) {
            this.displayPayments[index].editCode = false;
            this.displayPayments[index].overCode = false;
            this.createPlaceholderCode(index);
        }
    }

    onClickOutSideNotes(event: any, index: number) {
        if (event && event['value'] === true) {
            this.displayPayments[index].editNotes = false;
            this.displayPayments[index].overNotes = false;
            this.createPlaceholderNotes(index);
        }
    }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Payment} from '../../../shared/account/payment-block.model';

class DisplayValuesPayment {
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

    payments: Array<Payment>;

    displayPayments: Array<DisplayValuesPayment>;

    placeholderValueMethod = 'My method';
    placeholderValueCode = 'MYCODE';
    placeholderValueNotes = 'My notes !';

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
            , this.placeholderValueMethod, this.placeholderValueCode, this.placeholderValueNotes);
        const newDisplayPayment = new DisplayValuesPayment();

        this.displayPayments.push(newDisplayPayment);
        this.payments.push(newPayment);
    }

    onRemovePayment(index: number) {
        this.displayPayments.splice(index, 1);
        this.payments.splice(index, 1);
    }

    clearPlaceholderMethod(index: number) {
        if (this.payments[index].method === this.placeholderValueMethod) {
            this.payments[index].method = '';
        }
    }

    clearPlaceholderCode(index: number) {
        if (this.payments[index].code === this.placeholderValueCode) {
            this.payments[index].code = '';
        }
    }

    clearPlaceholderNotes(index: number) {
        if (this.payments[index].notes === this.placeholderValueNotes) {
            this.payments[index].notes = '';
        }
    }

    createPlaceholderMethod(index: number) {
        if (this.payments[index].method === '') {
            this.payments[index].method = this.placeholderValueMethod;
        }
    }

    createPlaceholderCode(index: number) {
        if (this.payments[index].code === '') {
            this.payments[index].code = this.placeholderValueCode;
        }
    }

    createPlaceholderNotes(index: number) {
        if (this.payments[index].notes === '') {
            this.payments[index].notes = this.placeholderValueNotes;
        }
    }
}

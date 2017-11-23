import {Component, OnDestroy, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Payment} from '../../../shared/account/payment-block.model';
import {MatDatepicker} from "@angular/material";
import {isUndefined} from "util";
import {PaymentCustomBlockConstant} from "../payment-custom-block.constant";

@Component({
    selector: 'jhi-payment-custom-block',
    templateUrl: './payment-custom-block.component.html',
    styleUrls: ['./payment-custom-block.component.scss']
})
export class PaymentCustomBlockComponent implements OnInit, OnDestroy {

    @ViewChild(MatDatepicker) picker;

    @Input() payments: Array<Payment>;
    @Output() onSyncPayments = new EventEmitter<Array<Payment>>();

    private _placeholderMethod: string
    private _placeholderCode: string;
    private _placeholderNotes: string;

    constructor() {
        this._placeholderMethod =  PaymentCustomBlockConstant.placeholderMethod;
        this._placeholderCode = PaymentCustomBlockConstant.placeholderCode;
        this._placeholderNotes = PaymentCustomBlockConstant.placeholderNotes;
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    onAddPayment() {
        const newPayment = new Payment(new Date(), 0, this._placeholderMethod
            , this._placeholderCode, this._placeholderNotes);

        this.payments.push(newPayment);
        this.onSyncPayments.emit(this.payments);
    }

    onRemovePayment(index: number) {
        this.payments.splice(index, 1);
        this.onSyncPayments.emit(this.payments);
    }

    onChangeDate(index: number, newValue: Date){
        const payment = this.payments[index];
        payment.date = newValue;
        this.payments[index] = payment;
    }

    onChangeAmount(index: number, newValue: number){
       const payment = this.payments[index];
        payment.amount = newValue;
        this.payments[index] = payment;
    }

    onChangeMethod(index: number, newValue: string){
        const payment = this.payments[index];
        payment.method = newValue;
        this.payments[index] = payment;
    }

    onChangeCode(index: number, newValue: string){
        const payment = this.payments[index];
        payment.code = newValue;
        this.payments[index] = payment;
    }

    onChangeNotes(index: number, newValue: string){
        const payment = this.payments[index];
        payment.notes = newValue;
        this.payments[index] = payment;
    }
}

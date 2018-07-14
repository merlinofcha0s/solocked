import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Payment } from '../../../shared/account/payment-block.model';
import { MatDatepicker, MatDialog, MatDialogRef } from '@angular/material';
import { PaymentCustomBlockConstant } from '../payment-custom-block.constant';
import { DeletePaymentLineComponent } from './delete-payment-line/delete-payment-line.component';
import { isUndefined } from 'util';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'jhi-payment-custom-block',
    templateUrl: './payment-custom-block.component.html',
    styleUrls: ['./payment-custom-block.component.scss'],
    animations: [
        trigger('appear', [
            state('void', style({ opacity: 0.0 })),
            state('*', style({ opacity: 1 })),
            transition('void => *, * => void', animate('500ms  ease-in-out'))
        ])
    ]
})
export class PaymentCustomBlockComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild(MatDatepicker) picker;

    @Input() payments: Array<Payment>;
    @Input() readOnlyMode: boolean;

    @Output() onSyncPayments = new EventEmitter<Array<Payment>>();
    @Output() suppressPaymentBlock = new EventEmitter<boolean>();

    _placeholderMethod: string;
    _placeholderCode: string;
    _placeholderNotes: string;

    average = '0';
    total = '0';

    @Input() expanded: boolean;
    @Output() expandedEvent = new EventEmitter<boolean>();

    accordionOpened: boolean;
    lastPayment: Payment;

    private deleteLinePayment: MatDialogRef<DeletePaymentLineComponent>;

    constructor(private dialog: MatDialog) {
        this._placeholderMethod = PaymentCustomBlockConstant.placeholderMethod;
        this._placeholderCode = PaymentCustomBlockConstant.placeholderCode;
        this._placeholderNotes = PaymentCustomBlockConstant.placeholderNotes;
    }

    ngOnInit() {
        this.computeAverageAndTotal();
        this.updateLastPayment();
        this.expandIfPayments();
    }

    ngOnDestroy(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        this.updateLastPayment();
    }

    onAddPayment() {
        const newPayment = new Payment(new Date(), 0, this._placeholderMethod, this._placeholderCode, this._placeholderNotes);

        this.payments.unshift(newPayment);
        this.onSyncPayments.emit(this.payments);
    }

    onRemovePayment(paymentToRemove: Payment, index: number) {
        this.deleteLinePayment = this.dialog.open(DeletePaymentLineComponent, {
            data: {
                title: 'ninjaccountApp.accountsDB.paymentblock.deletelinepopup.title',
                snackMessage: 'ninjaccountApp.accountsDB.paymentblock.deletelinepopup.snack',
                date: paymentToRemove.date
            }
        });

        this.deleteLinePayment.afterClosed().subscribe(result => {
            if (!isUndefined(result) && result === true) {
                this.payments.splice(index, 1);
                this.onSyncPayments.emit(this.payments);
            }
        });
    }

    onChangeDate(index: number, newValue: Date) {
        const payment = this.payments[index];
        payment.date = newValue;
        this.payments[index] = payment;
    }

    onChangeAmount(index: number, newValue: number) {
        const payment = this.payments[index];
        payment.amount = newValue;
        this.payments[index] = payment;
        this.computeAverageAndTotal();
    }

    onChangeMethod(index: number, newValue: string) {
        const payment = this.payments[index];
        payment.method = newValue;
        this.payments[index] = payment;
    }

    onChangeCode(index: number, newValue: string) {
        const payment = this.payments[index];
        payment.code = newValue;
        this.payments[index] = payment;
    }

    // onChangeNotes(index: number, newValue: string) {
    //     const payment = this.payments[index];
    //     payment.notes = newValue;
    //     this.payments[index] = payment;
    // }

    onSuppressPaymentBlock() {
        this.suppressPaymentBlock.emit(true);
    }

    computeAverageAndTotal() {
        if (this.payments.length >= 1) {
            const totalNotRounded = this.payments.map(payment => payment.amount).reduce((a, b) => Number(a) + Number(b));
            const averageNotRounded = totalNotRounded / this.payments.length;
            this.total = Number(totalNotRounded).toFixed(2);
            this.average = averageNotRounded.toFixed(2);
        }
    }

    onClose() {
        this.accordionOpened = false;
        this.expandedEvent.emit(this.accordionOpened);
    }

    onOpen() {
        this.accordionOpened = true;
        this.expandedEvent.emit(this.accordionOpened);
    }

    updateLastPayment() {
        if (this.payments.length > 0) {
            this.lastPayment = this.payments[0];
        }
    }

    expandIfPayments() {
        if (this.payments.length === 0) {
            this.expanded = true;
            this.expandedEvent.emit(this.accordionOpened);
        }
    }
}

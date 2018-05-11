import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Payment} from '../../../shared/account/payment-block.model';
import {MatDatepicker, MatDialog, MatDialogRef} from '@angular/material';
import {PaymentCustomBlockConstant} from '../payment-custom-block.constant';
import {DeletePaymentLineComponent} from './delete-payment-line/delete-payment-line.component';
import {isUndefined} from 'util';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'jhi-payment-custom-block',
    templateUrl: './payment-custom-block.component.html',
    styleUrls: ['./payment-custom-block.component.scss'],
    animations: [
        trigger('appear', [
            state('void', style({opacity: 0.0})),
            state('*', style({opacity: 1})),
            transition('void => *, * => void', animate('500ms  ease-in-out'))
        ])
    ]
})
export class PaymentCustomBlockComponent implements OnInit, OnDestroy {

    @ViewChild(MatDatepicker) picker;

    @Input() payments: Array<Payment>;
    @Input() readOnlyMode: boolean;
    @Input() expanded: boolean;
    @Output() onSyncPayments = new EventEmitter<Array<Payment>>();
    @Output() suppressPaymentBlock = new EventEmitter<boolean>();

    _placeholderMethod: string;
    _placeholderCode: string;
    _placeholderNotes: string;

    average = '0';
    total = 0;

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
    }

    ngOnDestroy(): void {
    }

    onAddPayment() {
        const newPayment = new Payment(new Date(), 0, this._placeholderMethod
            , this._placeholderCode, this._placeholderNotes);

        this.payments.unshift(newPayment);
        this.onSyncPayments.emit(this.payments);
    }

    onRemovePayment(index: number) {
        this.deleteLinePayment = this.dialog.open(DeletePaymentLineComponent, {
            data: {
                title: 'ninjaccountApp.accountsDB.paymentblock.deletelinepopup.title'
                , snackMessage: 'ninjaccountApp.accountsDB.paymentblock.deletelinepopup.snack'
            }
        });

        this.deleteLinePayment.afterClosed().subscribe((result) => {
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
            const totalNotRounded = this.payments.map((payment) => payment.amount)
                .reduce((a, b) => (Number(a) + Number(b)));
            const averageNotRounded = totalNotRounded / this.payments.length;
            const precision = Math.pow(10, 2);
            this.total = Math.round(totalNotRounded * precision) / precision;
            this.average = Math.round(averageNotRounded * precision) / precision + '';
        }
    }

    onClose() {
        if (this.payments.length > 0) {
            this.lastPayment = this.payments[this.payments.length - 1];
        }
        this.accordionOpened = false;
    }

    onOpen() {
        this.accordionOpened = true;
    }
}

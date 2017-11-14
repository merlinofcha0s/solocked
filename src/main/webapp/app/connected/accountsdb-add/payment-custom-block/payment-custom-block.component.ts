import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Payment} from '../../../shared/account/payment-block.model';

@Component({
    selector: 'jhi-payment-custom-block',
    templateUrl: './payment-custom-block.component.html',
    styleUrls: ['./payment-custom-block.component.scss']
})
export class PaymentCustomBlockComponent implements OnInit, OnDestroy {

    paymentForm: FormGroup;
    date: FormControl;
    amount: FormControl;
    method: FormControl;
    code: FormControl;
    notes: FormControl;

    payments: Array<Payment>;

    constructor(private formBuilder: FormBuilder) {
        this.payments = new Array<Payment>();
    }

    ngOnInit() {
        this.initForm();
    }

    ngOnDestroy(): void {

    }

    initForm() {
        this.date = this.formBuilder.control('');
        this.amount = this.formBuilder.control('');
        this.method = this.formBuilder.control('');
        this.code = this.formBuilder.control('');
        this.notes = this.formBuilder.control('');

        this.paymentForm = this.formBuilder.group({
            date: this.date,
            amount: this.amount,
            method: this.method,
            code: this.code,
            notes: this.notes
        });
    }

    onSubmitPayment() {
        const newPayment = new Payment(this.date.value, this.amount.value
            , this.method.value, this.code.value, this.notes.value);
        this.payments.push(newPayment);
    }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Payment} from '../../../shared/account/payment-block.model';

@Component({
    selector: 'jhi-payment-custom-block',
    templateUrl: './payment-custom-block.component.html',
    styleUrls: ['./payment-custom-block.component.scss']
})
export class PaymentCustomBlockComponent implements OnInit, OnDestroy {

    payments: Array<Payment>;

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

    constructor(private formBuilder: FormBuilder) {
        this.payments = new Array<Payment>();
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {

    }

    onSubmitPayment() {
        const newPayment = new Payment(new Date(), 100
            , 'VISA', 'FRHYGJD', 'Lorem ipsum !!!');
        this.payments.push(newPayment);
    }
}

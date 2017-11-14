import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Payment} from "../../../../shared/account/payment-block.model";

@Component({
    selector: 'jhi-payment-line',
    templateUrl: './payment-line.component.html',
    styleUrls: ['./payment-line.component.scss']
})
export class PaymentLineComponent implements OnInit, OnDestroy {

    @Input()
    line: Payment;


    constructor() {

    }

    ngOnInit() {
    }

    ngOnDestroy(): void {

    }

}

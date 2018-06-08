import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';
import {Payment} from '../../entities/payment/payment.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'jhi-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, OnDestroy {

    payment: Payment;
    paymentSub: Subscription;

    constructor(private paymentService: PaymentService) {
    }

    ngOnInit() {
        this.paymentSub = this.paymentService.payment$.subscribe((payment) => {
            this.payment = payment;
            console.log('plan : ' + this.payment.planType);
        });
        this.paymentService.getPaymentByLogin();
    }

    ngOnDestroy(): void {
        this.paymentSub.unsubscribe();
    }

    onChoosePlan() {
        // TODO REST POINT PAYPAL
    }
}

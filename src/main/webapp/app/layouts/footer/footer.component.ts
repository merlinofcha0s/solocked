import {Component, OnDestroy, OnInit} from '@angular/core';
import {Payment, PaymentService, PlanType} from '../../entities/payment';
import {Principal} from '../../shared';
import {Subscription} from 'rxjs/Subscription';
import {NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'jhi-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

    payment: Payment;
    paymentSub: Subscription;
    displayPaymentIssue: boolean;

    constructor(private paymentService: PaymentService,
                private principal: Principal,
                private router: Router) {
        this.displayPaymentIssue = false;
    }

    ngOnInit(): void {
        this.initPaymentService();

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/') {
                    this.displayPaymentIssue = false;
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.paymentSub.unsubscribe();
    }

    initPaymentService() {
        this.paymentSub = this.paymentService.payment$.subscribe((payment) => {
            this.payment = payment;
            this.displayPaymentIssue = this.isInPaymentWarning(payment);
        });
    }

    isInPaymentWarning(payment: Payment): boolean {
        return this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])
            && payment.planType.toString() !== PlanType.BETA
            && (!payment.paid || payment.planType.toString() === PlanType.FREE);
    }
}

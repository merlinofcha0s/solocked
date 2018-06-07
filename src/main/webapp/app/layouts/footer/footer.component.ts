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
    isInFreemode: boolean;
    isNotPaid: boolean;
    warningMessage: string;

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
        let isInPaymentWarning = false;
        const isAuthenticatedAndNotAdmin = this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN']);
        if (isAuthenticatedAndNotAdmin) {
            if (payment.planType.toString() === PlanType.FREE) {
                isInPaymentWarning = true;
                this.isInFreemode = true;
                this.isNotPaid = false;
                this.warningMessage = 'ninjaccountApp.payment.warningfreemode';
            } else if (!payment.paid || this.accountNotValidUntil()) {
                isInPaymentWarning = true;
                this.isNotPaid = true;
                this.isInFreemode = false;
                this.warningMessage = 'ninjaccountApp.payment.warningnotpaidmode';
            }
        }

        return isInPaymentWarning;
    }

    accountNotValidUntil(): boolean {
        const validUntil = new Date(this.payment.validUntil);
        return validUntil < new Date();
    }
}

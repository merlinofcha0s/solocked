import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment';
import {Principal} from '../../shared';
import {Subscription} from 'rxjs/Subscription';
import {NavigationEnd, Router} from '@angular/router';
import {PaymentWarning} from "../../entities/payment/payment-warning.model";

@Component({
    selector: 'jhi-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

    paymentWarning: PaymentWarning;
    paymentSub: Subscription;
    displayPaymentIssue: boolean;

    constructor(private paymentService: PaymentService,
                private router: Router,
                private principal: Principal) {
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
        this.paymentSub = this.paymentService.paymentWarning$.subscribe((paymentWarning) => {
            this.paymentWarning = paymentWarning;
            if (this.isAuthenticatedAndNotAdmin() && (this.paymentWarning.isInFreeMode || !this.paymentWarning.isValid || !this.paymentWarning.isPaid)) {
                this.displayPaymentIssue = true;
            }
        });
        this.paymentService.isInPaymentWarning();
    }

    isAuthenticatedAndNotAdmin(): boolean {
        return this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])
    }
}

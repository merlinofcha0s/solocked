import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { PaymentWarning } from 'app/entities/payment/payment-warning.model';
import { PaymentService } from 'app/entities/payment';
import { Principal } from 'app/core';
import { JhiEventManager } from 'ng-jhipster';

@Component({
    selector: 'jhi-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
    paymentWarning: PaymentWarning;
    paymentSub: Subscription;
    displayPaymentIssue: boolean;
    invertColor: boolean;

    constructor(
        private paymentService: PaymentService,
        private router: Router,
        private principal: Principal,
        private eventManager: JhiEventManager
    ) {
        this.displayPaymentIssue = false;
    }

    ngOnInit(): void {
        this.initPaymentService();

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.invertColor = event.url === '/register';
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
        this.paymentSub = this.paymentService.paymentWarning$.subscribe(paymentWarning => {
            this.paymentWarning = paymentWarning;

            this.displayPaymentIssue =
                this.isAuthenticatedAndNotAdmin() &&
                (this.paymentWarning.isInFreeMode || !this.paymentWarning.isValid || !this.paymentWarning.isPaid);
        });
        this.paymentService.getPaymentByLogin();
    }

    isAuthenticatedAndNotAdmin(): boolean {
        return this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN']);
    }

    openCookieManagement() {
        this.eventManager.broadcast({
            name: 'openSideNav',
            content: 'Open side nav cookie management'
        });
    }
}

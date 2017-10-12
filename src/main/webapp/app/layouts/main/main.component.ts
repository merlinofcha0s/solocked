import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationCancel, NavigationEnd, NavigationStart, Router} from '@angular/router';

import {JhiLanguageHelper, StateStorageService} from '../../shared';
import {PaymentService} from '../../entities/payment/payment.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Payment, PlanType} from '../../entities/payment/payment.model';
import {Principal} from '../../shared/auth/principal.service';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class JhiMainComponent implements OnInit {

    loginPage: boolean;
    payment$: BehaviorSubject<Payment>;
    paymentType = PlanType.FREE;

    constructor(private jhiLanguageHelper: JhiLanguageHelper,
                private router: Router,
                private paymentService: PaymentService,
                private principal: Principal) {
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'ninjaccountApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
            if (event instanceof NavigationEnd) {
                if (event.url === '/') {
                    this.loginPage = true;
                } else {
                    this.loginPage = false;
                }
            }
        });

        this.initPaymentService();
    }

    initPaymentService() {
        this.payment$ = this.paymentService.payment$;
        this.paymentService.getPaymentByLogin();
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {JhiLanguageHelper} from '../../shared';
import {PaymentService} from '../../entities/payment/payment.service';
import {Payment, PlanType} from '../../entities/payment/payment.model';
import {Principal} from '../../shared/auth/principal.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'body',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class JhiMainComponent implements OnInit {

    loginPage: boolean;

    constructor(private jhiLanguageHelper: JhiLanguageHelper,
                private router: Router) {}

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
    }

}

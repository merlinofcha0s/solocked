import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {JhiLanguageHelper} from '../../shared';
import {Principal} from '../../shared/auth/principal.service';
import {AutolockService} from '../navbar/autologout/autolock.service';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class JhiMainComponent implements OnInit {

    loginPage: boolean;

    constructor(private jhiLanguageHelper: JhiLanguageHelper
        , private router: Router
        , private principal: Principal
        , private autolockService: AutolockService) {
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
    }

    resetAutolockTime() {
        if (this.principal.isAuthenticated()) {
            this.autolockService.resetTimer();
        }
    }

}

import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

import { JhiLanguageHelper, Principal } from 'app/core';
import { AutolockService } from 'app/layouts/navbar/autologout/autolock.service';
import { ProfileService } from '../../layouts/profiles/profile.service';
import { MatDialog } from '@angular/material';
import { WarnBrowserComponent } from 'app/layouts/main/warn-browser/warn-browser.component';
import { AccountsDBService } from 'app/entities/accounts-db';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { CookieService } from 'ngx-cookie';
import { CookiePopupComponent } from 'app/layouts/main/cookie-mgt/cookie-popup.component';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class JhiMainComponent implements OnInit {
    isRegisterPage: boolean;
    schema = {
        '@context': 'http://schema.org',
        '@type': 'Application',
        name: 'SoLocked',
        url: 'https://solocked.com',
        description: 'All your accounts in one place.'
    };

    inProduction: boolean;

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private router: Router,
        private principal: Principal,
        private autolockService: AutolockService,
        private profileService: ProfileService,
        private dialog: MatDialog,
        private renderer: Renderer2,
        private accountsService: AccountsDBService,
        private angulartics2Piwik: Angulartics2Piwik,
        private cookieService: CookieService
    ) {}

    ngOnInit() {
        this.initEventRouter();
        this.detectEdge();
        this.loadProfile();
        this.angulartics2Piwik.startTracking();
        this.principal.identity(true).then(account => this.principal.initDefaultLanguage(account));
        this.initCookiePopup();
    }

    loadProfile() {
        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
        });
    }

    initEventRouter() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
                this.isRegisterPage = event.url === '/register';
                this.cacheDB();
            }
        });
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : 'ninjaccountApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    resetAutolockTime() {
        if (this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
            this.autolockService.resetTimer();
        }
    }

    detectEdge() {
        // Get IE or Edge browser version
        const version = this.isEdge();
        if (version >= 12) {
            this.dialog.open(WarnBrowserComponent, {});
        }
    }

    isEdge() {
        const ua = window.navigator.userAgent;
        const edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        // other browser
        return false;
    }

    private cacheDB() {
        if (this.principal.isAuthenticated() && !this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
            this.accountsService.getAccountsList();
        }
    }

    initCookiePopup() {
        const mtmConsent = this.cookieService.get('mtm_consent');
        const mtmConsentRemoved = this.cookieService.get('mtm_consent_removed');

        if (mtmConsent === undefined && mtmConsentRemoved === undefined && this.inProduction) {
            setTimeout(() => {
                this.dialog.open(CookiePopupComponent, {
                    width: '600px',
                    disableClose: true
                });
            }, 3000);
        }
    }
}

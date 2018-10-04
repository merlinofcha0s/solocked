import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

import { JhiLanguageHelper, Principal } from 'app/core';
import { AutolockService } from 'app/layouts/navbar/autologout/autolock.service';
import { ProfileService } from '../../layouts/profiles/profile.service';
import { MatDialog, MatSidenav } from '@angular/material';
import { WarnBrowserComponent } from 'app/layouts/main/warn-browser/warn-browser.component';
import { AccountsDBService } from 'app/entities/accounts-db';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { JhiEventManager } from 'ng-jhipster';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class JhiMainComponent implements OnInit {
    @ViewChild('sidenav') sidenav: MatSidenav;
    sideNavOpened: boolean;

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
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.initEventRouter();
        this.detectEdge();
        this.loadProfile();
        this.handleOpenSideNav();
        this.principal.identity(true).then(account => this.principal.initDefaultLanguage(account));
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

    onCloseSideNav() {
        this.sidenav.close();
    }

    onOpenSideNav() {
        this.sidenav.open();
    }

    handleOpenSideNav() {
        this.eventManager.subscribe('openSideNav', () => {
            this.onOpenSideNav();
        });
    }
}

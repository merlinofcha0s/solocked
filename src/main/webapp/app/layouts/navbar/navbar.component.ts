import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { AccountService, JhiLanguageHelper, LoginModalService } from 'app/core';
import { ProfileService } from '../../layouts/profiles/profile.service';
import { LoginService } from '../../core/login/login.service';
import { ScrollEvent } from 'app/shared/util/scroll.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.scss'],
    animations: [
        trigger('sticky', [
            state(
                'true',
                style({
                    position: 'fixed',
                    top: '0',
                    right: '0',
                    left: '0',
                    transform: 'translate(0px, 0px)',
                    'box-shadow': '0 2px 12px 0 rgba(0, 0, 0, 0.08)',
                    'background-color': 'white'
                })
            ),
            state(
                'intermediate',
                style({
                    position: 'fixed',
                    top: '0',
                    right: '0',
                    left: '0',
                    transform: 'translate(0px, -100px)'
                })
            ),
            state(
                'false',
                style({
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    left: '0',
                    transform: 'translate(0px, 0px)',
                    'background-color': 'transparent'
                })
            ),
            transition('intermediate => false, false => intermediate', animate('0.3s  ease-in-out')),
            transition('intermediate => true, true => intermediate', animate('0.3s  ease-in-out'))
        ])
    ]
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;

    activateStickyMenu: string;
    homePageMode: boolean;
    offsetScroll: string;

    invertColor: boolean;

    constructor(
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private sessionStorage: SessionStorageService,
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
        this.initListenerRouterEvent();

        this.activateStickyMenu = 'false';
    }

    ngOnInit() {
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
    }

    initListenerRouterEvent() {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.isNavbarCollapsed = true;
                this.homePageMode = event.url === '/';
                this.invertColor = event.url === '/register';
                if (this.homePageMode) {
                    this.offsetScroll = '-750';
                } else {
                    this.offsetScroll = '-100';
                }
            }
        });
    }

    changeLanguage(languageKey: string) {
        this.sessionStorage.store('locale', languageKey);
        this.languageService.changeLanguage(languageKey);
    }

    onClickTitleHeader() {
        if (this.accountService.isAuthenticated()) {
            this.router.navigate(['/accounts']);
        } else {
            this.router.navigate(['/']);
        }

        this.collapseNavbar();
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    //
    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
    }

    hasAnyAuthorityDirect(authorities: string[]): boolean {
        return this.accountService.hasAnyAuthority(authorities);
    }

    public handleScroll(event: ScrollEvent) {
        if (event.isReachingBottom && this.activateStickyMenu !== 'true') {
            this.activateStickyMenu = 'intermediate';
            setTimeout(() => {
                this.activateStickyMenu = 'true';
            }, 300);
        }

        if (event.isReachingTop && this.activateStickyMenu !== 'false') {
            this.activateStickyMenu = 'intermediate';
            setTimeout(() => {
                this.activateStickyMenu = 'false';
            }, 300);
        }
    }
}

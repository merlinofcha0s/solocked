import {Component, OnInit} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiLanguageService} from 'ng-jhipster';

import {ProfileService} from '../profiles/profile.service';
import {JhiLanguageHelper, LoginModalService, Principal} from '../../shared';
import {LoginService} from './../../shared/login/login.service';

import {VERSION} from '../../app.constants';
import {AccountsHomeRouteName} from '../../connected';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: [
        'navbar.scss'
    ],
    animations: [
        trigger('appear', [
            state('void', style({ opacity: 0.0})),
            state('*', style({ opacity: 1})),
            transition('void => *, * => void', animate('500ms  ease-in-out'))
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
    defaultColor: boolean;
    showSearch: boolean;

    constructor(private loginService: LoginService,
                private languageService: JhiLanguageService,
                private languageHelper: JhiLanguageHelper,
                private principal: Principal,
                private loginModalService: LoginModalService,
                private profileService: ProfileService,
                private router: Router) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
        this.initListenerRouterEvent();
    }

    ngOnInit() {
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
    }

    initListenerRouterEvent() {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                if (event.url !== '/') {
                    this.defaultColor = true;
                } else {
                    this.defaultColor = false;
                }

                if (event.url === '/' + AccountsHomeRouteName) {
                    this.showSearch = false;
                } else {
                    this.showSearch = true;
                }
            }
        });
    }

    changeLanguage(languageKey: string) {
        this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

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
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    hasAnyAuthorityDirect(authorities: string[]): boolean {
        return this.principal.hasAnyAuthorityDirect(authorities);
    }
}

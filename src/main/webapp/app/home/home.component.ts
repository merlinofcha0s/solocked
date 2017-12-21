import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {Account, LoginModalService, Principal} from '../shared';
import {Meta} from '@angular/platform-browser';
import {ProfileService} from '../layouts/profiles/profile.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]

})
export class HomeComponent implements OnInit, OnDestroy {

    account: Account;
    modalRef: NgbModalRef;
    inProduction: boolean;

    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private eventManager: JhiEventManager,
                private meta: Meta,
                private profileService: ProfileService) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();

        this.profileService.getProfileInfo().then((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            if (!this.inProduction) {
                this.meta.addTag({name: 'robots', content: 'noindex, nofollow'});
            }
        });
    }

    ngOnDestroy(): void {
        if (!this.inProduction) {
            this.meta.removeTag('name=\'robots\'');
        }
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}

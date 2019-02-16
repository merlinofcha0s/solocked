import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbCarouselConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Meta } from '@angular/platform-browser';
import { AccountService, LoginModalService } from 'app/core';
import { ProfileService } from '../layouts/profiles/profile.service';
import { VERSION } from 'app/app.constants';
import { SocialService } from 'app/shared/social/social.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss'],
    providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    modalRef: NgbModalRef;
    inProduction: boolean;
    version: string;
    tweet: any;

    constructor(
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private meta: Meta,
        private profileService: ProfileService,
        private config: NgbCarouselConfig,
        private socialService: SocialService,
        private accountService: AccountService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.getLatestTweet();
    }

    ngOnInit() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            if (!this.inProduction) {
                this.meta.addTag({ name: 'robots', content: 'noindex, nofollow' });
            }
        });
    }

    ngOnDestroy(): void {
        if (!this.inProduction) {
            this.meta.removeTag("name='robots'");
        }
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getLatestTweet() {
        this.socialService.getLatestTweet().subscribe(tweet => {
            this.tweet = tweet;
            tweet.profileImageUrl = tweet.profileImageUrl.replace('http', 'https');
        });
    }
}

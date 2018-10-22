import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { TranslateService } from '@ngx-translate/core';

declare var _paq: any;
declare var LiveZilla: any;

@Component({
    selector: 'jhi-cookie-mgt',
    templateUrl: './cookie-mgt.component.html',
    styleUrls: ['./cookie-mgt.component.scss']
})
export class CookieMgtComponent implements OnInit {
    isLivezillaActivated: boolean;
    isMatomoActivated: boolean;

    buttonLabel: string;

    @Output() onOpenSideNav = new EventEmitter<boolean>();
    @Output() onCloseSideNav = new EventEmitter<boolean>();

    constructor(private cookieService: CookieService, private translateService: TranslateService) {}

    ngOnInit(): void {
        this.buttonLabel = 'Accept Recommended settings';

        const mtmConsent = this.cookieService.get('mtm_consent');
        const mtmConsentRemoved = this.cookieService.get('mtm_consent_removed');

        if (mtmConsent === undefined && mtmConsentRemoved === undefined) {
            setTimeout(() => {
                this.onOpenSideNav.emit(true);
                this.translateService.get('home.cookieMgt.yesRecommend').subscribe(value => {
                    this.buttonLabel = value;
                });
            }, 2000);
        }
    }

    onChangeSlide() {
        if (this.isLivezillaActivated || this.isMatomoActivated) {
            this.translateService.get('home.cookieMgt.yes').subscribe(value => {
                this.buttonLabel = value;
            });
        } else {
            this.translateService.get('home.cookieMgt.yesRecommend').subscribe(value => {
                this.buttonLabel = value;
            });
        }
    }

    onAcceptSettings() {
        if (typeof _paq !== 'undefined') {
            if (!this.isLivezillaActivated && !this.isMatomoActivated) {
                this.activateMatomo();
                this.activateLivezilla();
            } else {
                if (this.isMatomoActivated) {
                    this.activateMatomo();
                } else {
                    this.deactivateMatomo();
                }

                if (this.isLivezillaActivated) {
                    this.activateLivezilla();
                } else {
                    this.deactivateLivezilla();
                }
            }
        }
        this.onCloseSideNav.emit(true);
    }

    onNoSettings() {
        this.deactivateMatomo();
        this.deactivateLivezilla();
        this.onCloseSideNav.emit(true);
    }

    activateMatomo() {
        if (typeof _paq !== 'undefined') {
            // 720h = 1 month
            _paq.push(['rememberConsentGiven', 720]);
        }
    }

    deactivateMatomo() {
        if (typeof _paq !== 'undefined') {
            _paq.push(['forgetConsentGiven']);
        }
    }

    activateLivezilla() {
        LiveZilla.OptInCookies();
    }

    deactivateLivezilla() {
        LiveZilla.OptOutCookies();
    }
}

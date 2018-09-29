import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { initLivezilla, ProdConfig } from 'app/blocks/config/prod.config';
import { CookieService } from 'ngx-cookie';

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

    constructor(private cookieService: CookieService) {}

    ngOnInit(): void {
        this.buttonLabel = 'Accept Recommended settings';

        const mtmConsent = this.cookieService.get('mtm_consent');
        const mtmConsentRemoved = this.cookieService.get('mtm_consent_removed');

        if (mtmConsent === undefined && mtmConsentRemoved === undefined) {
            setTimeout(() => {
                this.onOpenSideNav.emit(true);
            }, 2000);
        }
    }

    onChangeSlide() {
        if (this.isLivezillaActivated || this.isMatomoActivated) {
            this.buttonLabel = 'Accept your settings';
        } else {
            this.buttonLabel = 'Accept Recommended settings';
        }
    }

    onAcceptSettings() {
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

        this.onCloseSideNav.emit(true);
    }

    onNoSettings() {
        this.deactivateMatomo();
        this.deactivateLivezilla();
        this.onCloseSideNav.emit(true);
    }

    activateMatomo() {
        if (_paq !== undefined) {
            // 720h = 1 month
            _paq.push(['rememberConsentGiven', 720]);
        }
    }

    deactivateMatomo() {
        if (_paq !== undefined) {
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

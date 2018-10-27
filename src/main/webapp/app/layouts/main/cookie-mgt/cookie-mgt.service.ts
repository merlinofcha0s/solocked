import { Injectable } from '@angular/core';

declare var _paq: any;
declare var LiveZilla: any;

@Injectable({ providedIn: 'root' })
export class CookieMgtService {
    constructor() {}

    acceptSettings(isLivezillaActivated: boolean, isMatomoActivated: boolean) {
        if (typeof _paq !== 'undefined') {
            if (!isLivezillaActivated && !isMatomoActivated) {
                this.activateMatomo();
                this.activateLivezilla();
            } else {
                if (isMatomoActivated) {
                    this.activateMatomo();
                } else {
                    this.deactivateMatomo();
                }

                if (isLivezillaActivated) {
                    this.activateLivezilla();
                } else {
                    this.deactivateLivezilla();
                }
            }
        }
    }

    noSettings() {
        this.deactivateMatomo();
        this.deactivateLivezilla();
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
        if (typeof LiveZilla !== 'undefined') {
            LiveZilla.OptInCookies();
        }
    }

    deactivateLivezilla() {
        if (typeof LiveZilla !== 'undefined') {
            LiveZilla.OptOutCookies();
        }
    }
}

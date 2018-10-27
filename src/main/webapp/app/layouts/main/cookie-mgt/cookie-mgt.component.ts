import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CookieMgtService } from 'app/layouts/main/cookie-mgt/cookie-mgt.service';
import { SnackUtilService } from 'app/shared/snack/snack-util.service';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-cookie-mgt',
    templateUrl: './cookie-mgt.component.html',
    styleUrls: ['./cookie-mgt.component.scss']
})
export class CookieMgtComponent implements OnInit {
    isLivezillaActivated: boolean;
    isMatomoActivated: boolean;

    buttonLabel: string;

    constructor(
        private cookieService: CookieService,
        private translateService: TranslateService,
        private cookieMgtService: CookieMgtService,
        private snackUtilsService: SnackUtilService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initLabelButtonAccept();
    }

    private initLabelButtonAccept() {
        this.translateService.get('home.cookieMgt.yesRecommend').subscribe(value => {
            this.buttonLabel = value;
        });
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.translateService.get('home.cookieMgt.yesRecommend').subscribe(value => {
                this.buttonLabel = value;
            });
        });
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
        this.cookieMgtService.acceptSettings(this.isLivezillaActivated, this.isMatomoActivated);
        this.validatePrivacyChoice();
    }

    onNoSettings() {
        this.cookieMgtService.noSettings();
        this.validatePrivacyChoice();
    }

    private validatePrivacyChoice() {
        this.snackUtilsService.openSnackBar('home.cookieMgt.confirmation', 3000, 'check-circle');
        this.router.navigate(['/']);
    }
}

import {Component, OnInit} from '@angular/core';
import {JhiLanguageService} from 'ng-jhipster';

import {Principal, AccountService, JhiLanguageHelper} from '../../shared';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SnackComponent} from '../../shared/snack/snack.component';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    error: string;
    success: string;
    settingsAccount: any;
    languages: any[];
    loading = false;

    constructor(private account: AccountService,
                private principal: Principal,
                private languageService: JhiLanguageService,
                private languageHelper: JhiLanguageHelper,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.settingsAccount = this.copyAccount(account);
        });
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });
    }

    save() {
        this.loading = true;
        this.account.save(this.settingsAccount).subscribe(() => {
            this.error = null;
            this.loading = false;
            this.success = 'OK';
            this.principal.identity(true).then((account) => {
                this.settingsAccount = this.copyAccount(account);
            });
            this.languageService.getCurrent().then((current) => {
                if (this.settingsAccount.langKey !== current) {
                    this.languageService.changeLanguage(this.settingsAccount.langKey);
                }
            });

            // Config and show toast message
            const config = new MatSnackBarConfig();
            config.verticalPosition = 'top';
            config.duration = 3000;

            const message = this.translateService.instant('settings.messages.success');
            config.data = {icon: 'fa-check-circle-o', text: message}
            this.snackBar.openFromComponent(SnackComponent, config);

        }, () => {
            this.success = null;
            this.error = 'ERROR';
            this.loading = false;
        });
    }

    copyAccount(account) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            login: account.login,
            imageUrl: account.imageUrl
        };
    }
}

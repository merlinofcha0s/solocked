import {Component, OnDestroy, OnInit} from '@angular/core';
import {JhiLanguageService} from 'ng-jhipster';

import {AccountService, JhiLanguageHelper, Principal} from '../../shared';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SnackComponent} from '../../shared/snack/snack.component';
import {AccountsDBService} from '../../entities/accounts-db/accounts-db.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

    error: string;
    success: string;
    settingsAccount: any;
    languages: any[];
    loading = false;
    actual: number;
    max: number;
    actualPercentage: number;
    colorActualAccount: string;
    private actualMaxSubscription: Subscription

    maxUsername = 40;
    maxLastname = 50;
    maxFirstname = 50;
    maxEmail = 100;

    constructor(private account: AccountService,
                private principal: Principal,
                private languageService: JhiLanguageService,
                private languageHelper: JhiLanguageHelper,
                private snackBar: MatSnackBar,
                private translateService: TranslateService,
                private accountDbService: AccountsDBService) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.settingsAccount = this.copyAccount(account);
        });
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });
        this.initActualAndMaxAccount();
    }

    ngOnDestroy(): void {
        this.actualMaxSubscription.unsubscribe();
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

    initActualAndMaxAccount() {
        this.actualMaxSubscription = this.accountDbService.getActualMaxAccount().subscribe((actualAndMax) => {
            this.actual = actualAndMax.first;
            this.max = actualAndMax.second;
            this.actualPercentage = (this.actual / this.max) * 100;

            if (this.actual === this.max) {
                this.colorActualAccount = 'warn';
            } else {
                this.colorActualAccount = 'primary';
            }
        });
        this.accountDbService.getActualMaxAccount();
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

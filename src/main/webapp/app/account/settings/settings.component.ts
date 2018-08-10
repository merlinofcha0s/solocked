import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ResetAllAccountsComponent } from 'app/account/settings/reset-all-accounts/reset-all-accounts.component';
import { AccountService, JhiLanguageHelper, Principal } from 'app/core';
import { AccountsDBService } from 'app/entities/accounts-db';
import { SnackUtilService } from 'app/shared/snack/snack-util.service';
import { ExportAllAccountsComponent } from 'app/account/settings/export-all-accounts/export-all-accounts.component';
import { DeleteAllAccountsComponent } from 'app/account/settings/delete-all-accounts/delete-all-accounts.component';
import { LOCALE } from 'app/shared/constants/session-storage.constants';
import { LocalStorageService } from 'ngx-webstorage';

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
    private actualMaxSubscription: Subscription;

    maxUsername = 40;
    maxLastname = 50;
    maxFirstname = 50;
    maxEmail = 100;

    private resetAllAccountsPopup: MatDialogRef<ResetAllAccountsComponent>;

    actualAndMaxNumber$: BehaviorSubject<any>;

    constructor(
        private account: AccountService,
        private principal: Principal,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private accountDbService: AccountsDBService,
        public dialog: MatDialog,
        private snackUtil: SnackUtilService,
        private localStorage: LocalStorageService
    ) {
        this.actualAndMaxNumber$ = this.accountDbService.actualAndMaxNumber$;
    }

    ngOnInit() {
        this.principal.identity().then(account => {
            this.settingsAccount = this.copyAccount(account);
        });
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });
        this.initActualAndMaxAccount();
    }

    ngOnDestroy(): void {
        this.actualMaxSubscription.unsubscribe();
    }

    save() {
        this.loading = true;
        this.account.save(this.settingsAccount).subscribe(
            () => {
                this.error = null;
                this.loading = false;
                this.success = 'OK';
                this.principal.identity(true).then(account => {
                    this.settingsAccount = this.copyAccount(account);
                });
                this.languageService.getCurrent().then(current => {
                    if (this.settingsAccount.langKey !== current) {
                        this.localStorage.store(LOCALE, this.settingsAccount.langKey);
                        this.languageService.changeLanguage(this.settingsAccount.langKey);
                        location.reload();
                    }
                });
                this.snackUtil.openSnackBar('settings.messages.success', 3000, 'check-circle');
            },
            () => {
                this.success = null;
                this.error = 'ERROR';
                this.loading = false;
            }
        );
    }

    initActualAndMaxAccount() {
        if (this.actualMaxSubscription) {
            this.actualMaxSubscription.unsubscribe();
        }
        this.actualMaxSubscription = this.actualAndMaxNumber$.subscribe(actualAndMax => {
            this.actual = actualAndMax.first;
            this.max = actualAndMax.second;
            this.actualPercentage = this.actual / this.max * 100;

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

    openExportAccountPopup() {
        const accounts = this.accountDbService.getAccountsListInstant();
        if (accounts.length !== 0) {
            this.dialog.open(ExportAllAccountsComponent, {});
        } else {
            this.snackUtil.openSnackBar('settings.danger.export.nodata', 5000, 'exclamation-triangle');
        }
    }

    openDeleteAccountsPopup() {
        this.dialog.open(DeleteAllAccountsComponent, {});
    }

    openResetAllAccountsPopup() {
        this.resetAllAccountsPopup = this.dialog.open(ResetAllAccountsComponent, {});
    }
}

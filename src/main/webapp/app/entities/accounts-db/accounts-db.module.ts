import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { NinjaccountSharedModule } from 'app/shared';
import {
    AccountsDBComponent,
    AccountsDBDetailComponent,
    AccountsDBUpdateComponent,
    AccountsDBDeletePopupComponent,
    AccountsDBDeleteDialogComponent,
    accountsDBRoute,
    accountsDBPopupRoute
} from './';

const ENTITY_STATES = [...accountsDBRoute, ...accountsDBPopupRoute];

@NgModule({
    imports: [NinjaccountSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AccountsDBComponent,
        AccountsDBDetailComponent,
        AccountsDBUpdateComponent,
        AccountsDBDeleteDialogComponent,
        AccountsDBDeletePopupComponent
    ],
    entryComponents: [AccountsDBComponent, AccountsDBUpdateComponent, AccountsDBDeleteDialogComponent, AccountsDBDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountAccountsDBModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { NinjaccountSharedModule } from 'app/shared';
import { accountsDBPopupRoute, accountsDBRoute } from 'app/entities/accounts-db/accounts-db.route';
import { AccountsDBComponent } from 'app/entities/accounts-db/accounts-db.component';
import { AccountsDBDetailComponent } from 'app/entities/accounts-db/accounts-db-detail.component';
import { AccountsDBUpdateComponent } from 'app/entities/accounts-db/accounts-db-update.component';
import {
    AccountsDBDeleteDialogComponent,
    AccountsDBDeletePopupComponent
} from 'app/entities/accounts-db/accounts-db-delete-dialog.component';

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

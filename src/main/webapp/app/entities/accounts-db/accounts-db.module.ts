import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from 'app/shared';
import { NinjaccountAdminModule } from 'app/admin/admin.module';
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
    imports: [NinjaccountSharedModule, NinjaccountAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AccountsDBComponent,
        AccountsDBDetailComponent,
        AccountsDBUpdateComponent,
        AccountsDBDeleteDialogComponent,
        AccountsDBDeletePopupComponent
    ],
    entryComponents: [AccountsDBComponent, AccountsDBUpdateComponent, AccountsDBDeleteDialogComponent, AccountsDBDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountAccountsDBModule {}

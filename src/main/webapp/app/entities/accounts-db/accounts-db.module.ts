import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from '../../shared';
import { NinjaccountAdminModule } from '../../admin/admin.module';
import {
    AccountsDBService,
    AccountsDBPopupService,
    AccountsDBComponent,
    AccountsDBDetailComponent,
    AccountsDBDialogComponent,
    AccountsDBPopupComponent,
    AccountsDBDeletePopupComponent,
    AccountsDBDeleteDialogComponent,
    accountsDBRoute,
    accountsDBPopupRoute,
} from './';

const ENTITY_STATES = [
    ...accountsDBRoute,
    ...accountsDBPopupRoute,
];

@NgModule({
    imports: [
        NinjaccountSharedModule,
        NinjaccountAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        AccountsDBComponent,
        AccountsDBDetailComponent,
        AccountsDBDialogComponent,
        AccountsDBDeleteDialogComponent,
        AccountsDBPopupComponent,
        AccountsDBDeletePopupComponent,
    ],
    entryComponents: [
        AccountsDBComponent,
        AccountsDBDialogComponent,
        AccountsDBPopupComponent,
        AccountsDBDeleteDialogComponent,
        AccountsDBDeletePopupComponent,
    ],
    providers: [
        AccountsDBService,
        AccountsDBPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountAccountsDBModule {}

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {NinjaccountSharedModule} from '../../shared';
import {NinjaccountAdminModule} from '../../admin/admin.module';
import {
    AccountsDBComponent,
    AccountsDBDeleteDialogComponent,
    AccountsDBDeletePopupComponent,
    AccountsDBDetailComponent,
    AccountsDBDialogComponent,
    AccountsDBPopupComponent,
    accountsDBPopupRoute,
    AccountsDBPopupService,
    accountsDBRoute,
    AccountsDBService,
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

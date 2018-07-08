import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from 'app/shared';
import { NinjaccountAdminModule } from 'app/admin/admin.module';
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

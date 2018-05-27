import {NinjaccountSharedModule} from './../shared/shared.module';
import {ACCOUNTSDB_ROUTES} from './connected.route';
import {RouterModule} from '@angular/router';
import {AccountsdbAddComponent} from './accountsdb-add/accountsdb-add.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountsdbHomeComponent} from './accountsdb-home/accountsdb-home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClipboardModule} from 'ngx-clipboard';
import {AccountsdbListComponent} from './accountsdb-home/accountsdb-list/accountsdb-list.component';
import {AddCustomBlockComponent} from './accountsdb-add/add-custom-block/add-custom-block.component';
import {PaymentCustomBlockComponent} from './accountsdb-add/payment-custom-block/payment-custom-block.component';
import {ClickOutsideDirective} from './accountsdb-add/payment-custom-block/click-outside.directive';
import {EditInlineTileComponent} from './accountsdb-add/payment-custom-block/edit-inline-tile/edit.inline.tile.component';
import {EditDateInlineTileComponent} from './accountsdb-add/payment-custom-block/edit-date-inline-tile/edit.date.inline.tile.component';
import {DeletePaymentLineComponent} from './accountsdb-add/payment-custom-block/delete-payment-line/delete-payment-line.component';
import {MatDialogModule} from '@angular/material/dialog';
import {AccountsdbSearchComponent} from './accountsdb-home/accountsdb-search/accountsdb-search.component';
import {AccountsdbDeleteComponent} from './accountsdb-delete/accountsdb-delete.component';
import {CopyClipboardComponent} from './accountsdb-add/copy-clipboard/copy-clipboard.component';
import {CustomFieldsComponent} from './accountsdb-add/custom-field/custom-fields.component';
import {BillingComponent} from './billing/billing.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(ACCOUNTSDB_ROUTES, {useHash: true}),
        FormsModule,
        ReactiveFormsModule,
        NinjaccountSharedModule,
        ClipboardModule,
        MatDialogModule
    ],
    declarations: [
        AccountsdbAddComponent,
        AccountsdbHomeComponent,
        AccountsdbListComponent,
        AccountsdbDeleteComponent,
        AccountsdbSearchComponent,
        AddCustomBlockComponent,
        PaymentCustomBlockComponent,
        ClickOutsideDirective,
        EditInlineTileComponent,
        EditDateInlineTileComponent,
        DeletePaymentLineComponent,
        CopyClipboardComponent,
        CustomFieldsComponent,
        BillingComponent
    ],
    entryComponents: [AccountsdbDeleteComponent, AddCustomBlockComponent, DeletePaymentLineComponent],
})
export class NinjaccountConnectedModule {
}

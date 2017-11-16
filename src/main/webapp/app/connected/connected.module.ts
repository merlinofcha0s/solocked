import {TagsPipe} from './accountsdb-home/tags.pipe';
import {NinjaccountSharedModule} from './../shared/shared.module';
import {ACCOUNTSDB_ROUTES} from './connected.route';
import {RouterModule} from '@angular/router';
import {AccountsdbAddComponent} from './accountsdb-add/accountsdb-add.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountsdbHomeComponent} from './accountsdb-home/accountsdb-home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AccountsdbDetailsComponent} from './accountsdb-details/accountsdb-details.component';
import {PasswordHidePipe} from './accountsdb-details/password-hide.pipe';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {AccountsdbListComponent} from './accountsdb-home/accountsdb-list/accountsdb-list.component';
import { AccountsdbDeleteComponent } from './accountsdb-details/accountsdb-delete/accountsdb-delete.component';
import {AddCustomBlockComponent} from './accountsdb-add/add-custom-block/add-custom-block.component';
import {PaymentCustomBlockComponent} from './accountsdb-add/payment-custom-block/payment-custom-block.component';
import {PaymentLineComponent} from "./accountsdb-add/payment-custom-block/payment-line/payment-line.component";
import {ClickOutsideDirective} from './accountsdb-add/payment-custom-block/click-outside.directive';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(ACCOUNTSDB_ROUTES, {useHash: true}),
        FormsModule,
        ReactiveFormsModule,
        NinjaccountSharedModule,
        ClipboardModule
    ],
    declarations: [
        AccountsdbAddComponent,
        AccountsdbHomeComponent,
        TagsPipe,
        PasswordHidePipe,
        AccountsdbDetailsComponent,
        AccountsdbListComponent,
        AccountsdbDeleteComponent,
        AddCustomBlockComponent,
        PaymentCustomBlockComponent,
        PaymentLineComponent,
        ClickOutsideDirective
    ],
    entryComponents: [AccountsdbDeleteComponent, AddCustomBlockComponent],
})
export class NinjaccountConnectedModule {
}

import { ACCOUNTSDB_ROUTES } from './connected.route';
import { RouterModule } from '@angular/router';
import { AccountsdbAddComponent } from './accountsdb-add/accountsdb-add.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsdbHomeComponent } from './accountsdb-home/accountsdb-home.component';
import { AccountsdbPopupAddComponent } from './accountsdb-popup-add/accountsdb-popup-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ACCOUNTSDB_ROUTES, { useHash: true }),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AccountsdbAddComponent,
    AccountsdbHomeComponent,
    AccountsdbPopupAddComponent
  ],
  entryComponents: [AccountsdbPopupAddComponent]
})
export class NinjaccountConnectedModule { }

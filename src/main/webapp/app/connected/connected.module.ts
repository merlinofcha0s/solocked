import { ACCOUNTSDB_ROUTES } from './connected.route';
import { RouterModule } from '@angular/router';
import { AccountsdbAddComponent } from './accountsdb-add/accountsdb-add.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsdbHomeComponent } from './accountsdb-home/accountsdb-home.component';
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
    AccountsdbHomeComponent
  ]
})
export class NinjaccountConnectedModule { }
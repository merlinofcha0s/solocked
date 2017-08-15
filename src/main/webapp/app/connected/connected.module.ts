import { ACCOUNTSDB_ROUTES } from './connected.route';
import { RouterModule } from '@angular/router';
import { AccountsdbAddComponent } from './accountsdb-add/accountsdb-add.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsdbHomeComponent } from './accountsdb-home/accountsdb-home.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ACCOUNTSDB_ROUTES, { useHash: true })
  ],
  declarations: [
    AccountsdbAddComponent,
    AccountsdbHomeComponent
  ]
})
export class NinjaccountConnectedModule { }

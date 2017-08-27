import { AccountsService } from './../../shared/account/accounts.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SessionStorageService } from 'ng2-webstorage';
import { Account } from '../../shared/account/account.model';

import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'jhi-accountdb-home',
  templateUrl: './accountsdb-home.component.html',
  // styleUrls: ['./accountsdb-home.component.scss']
})
export class AccountsdbHomeComponent implements OnInit {

  accounts$: BehaviorSubject<Array<Account>>;
  filter: string;

  constructor(private accountsService: AccountsService) {

  }

  ngOnInit() {
    this.initAccountsList();
  }

  initAccountsList() {
    this.accounts$ = this.accountsService.accounts$;
    this.accountsService.getAccountsList();
  }

  onDelete(id: number) {
    this.accountsService.deleteAccount(id);
  }

}

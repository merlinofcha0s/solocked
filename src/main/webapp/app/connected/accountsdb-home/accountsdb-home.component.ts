import { SessionStorageService, SessionStorage} from 'ng2-webstorage';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-accountdb-home',
  templateUrl: './accountsdb-home.component.html',
  // styleUrls: ['./accountsdb-home.component.scss']
})
export class AccountsdbHomeComponent implements OnInit {

  @SessionStorage('accountsdb')
  accountDBJSON: string;

  constructor(private sessionStorage: SessionStorageService) {

  }

  ngOnInit() {
  }
}

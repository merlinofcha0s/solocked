import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AccountType, AccountTypeToRoute } from '../../shared/account/account-type.model';

@Component({
  selector: 'jhi-accountsdb-popup-add',
  templateUrl: './accountsdb-popup-add.component.html',
  styles: ['./accountsdb-popup-add.component.scss']
})
export class AccountsdbPopupAddComponent implements OnInit {

  constructor(private router: Router, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  getAllAccountType(): Array<string> {
    const keys = Object.keys(AccountType);
    return keys.slice(keys.length / 2);
  }

  goNewAccount(accountType: string) {
    this.activeModal.dismiss('choosing type of account');
    const routeToForm = AccountTypeToRoute.getValue(accountType);
    this.router.navigate(['accounts/' + routeToForm]);
  }

}

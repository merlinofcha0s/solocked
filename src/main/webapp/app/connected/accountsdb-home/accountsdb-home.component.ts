import { AccountsdbPopupAddComponent } from './../accountsdb-popup-add/accountsdb-popup-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-accountdb-home',
  templateUrl: './accountsdb-home.component.html',
  styles: ['./accountsdb-home.compon.scss']
})
export class AccountsdbHomeComponent implements OnInit {

  constructor(private modalService: NgbModal) {

  }

  ngOnInit() {

  }

  openAddAccountModal() {
    this.modalService.open(AccountsdbPopupAddComponent);
  }

}

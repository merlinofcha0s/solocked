import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account } from '../../shared/account/account.model';
import { AccountType } from "../../shared/account/account-type.model";


@Component({
  selector: 'jhi-accountsdb-add',
  templateUrl: './accountsdb-add.component.html',
  styles: ['./accountsdb-add.component.scss']
})
export class AccountsdbAddComponent implements OnInit {

  accountForm: FormGroup;
  accountName: FormControl;
  accountNumber: FormControl;
  username: FormControl;
  password: FormControl;
  loginURL: FormControl;
  notes: FormControl;
  contactURL: FormControl;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.accountName = this.fb.control('', Validators.compose(
      [Validators.required]));

    this.accountNumber = this.fb.control('');

    this.username = this.fb.control('', Validators.compose(
      [Validators.required]));

    this.password = this.fb.control('', Validators.compose(
      [Validators.required]));

    this.loginURL = this.fb.control('');

    this.notes = this.fb.control('');

    this.contactURL = this.fb.control('');

    this.accountForm = this.fb.group({
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      username: this.username,
      password: this.password,
      loginURL: this.loginURL,
      notes: this.notes,
      contactURL: this.contactURL
    });
  }

  onSubmitNewAccount() {
    const newAccount = new Account(this.username.value, this.password.value, this.accountName.value, AccountType.Default);
    newAccount.contactURL = this.contactURL.value;
    newAccount.loginURL = this.loginURL.value;
    newAccount.number = this.accountNumber.value;
    newAccount.notes = this.notes.value;
  }

}

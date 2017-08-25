import { Router } from '@angular/router';
import { AccountsDB } from './../../entities/accounts-db/accounts-db.model';
import { AccountsService } from './../../shared/account/accounts.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account } from '../../shared/account/account.model';

@Component({
  selector: 'jhi-accountsdb-add',
  templateUrl: './accountsdb-add.component.html',
  styleUrls: ['./accountsdb-add.component.scss']
})
export class AccountsdbAddComponent implements OnInit {

  accountForm: FormGroup;
  accountName: FormControl;
  accountNumber: FormControl;
  username: FormControl;
  password: FormControl;
  notes: FormControl;
  tags: FormControl;

  loading: boolean;

  constructor(private fb: FormBuilder,
     private accountsService: AccountsService,
     private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.accountName = this.fb.control('', Validators.compose([Validators.required]));
    this.accountNumber = this.fb.control('');
    this.username = this.fb.control('', Validators.compose([Validators.required]));
    this.password = this.fb.control('', Validators.compose([Validators.required]));
    this.notes = this.fb.control('');
    this.tags = this.fb.control('');

    this.accountForm = this.fb.group({
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      username: this.username,
      password: this.password,
      notes: this.notes,
      tags: this.tags
    });
  }

  onSubmitNewAccount() {
    const newAccount = new Account(this.username.value, this.password.value, this.accountName.value);
    newAccount.number = this.accountNumber.value;
    newAccount.notes = this.notes.value;
    newAccount.tags = this.tags.value.split(' ');
    newAccount.tags.push(this.accountName.value);

    this.loading = true;
    this.accountsService.saveNewAccount(newAccount)
      .subscribe((accountsUpdated: AccountsDB) => {
        this.loading = false;
        this.router.navigate(['accounts']);
      },
      (error) => this.loading = false);
  }

}

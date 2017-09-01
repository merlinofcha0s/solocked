import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountsDB } from './../../entities/accounts-db/accounts-db.model';
import { AccountsService } from './../../shared/account/accounts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account } from '../../shared/account/account.model';

@Component({
  selector: 'jhi-accountsdb-add',
  templateUrl: './accountsdb-add.component.html',
  styleUrls: ['./accountsdb-add.component.scss']
})
export class AccountsdbAddComponent implements OnInit, OnDestroy {

  header: string;

  accountForm: FormGroup;
  accountName: FormControl;
  accountNumber: FormControl;
  username: FormControl;
  password: FormControl;
  notes: FormControl;
  tags: FormControl;
  button: string;

  loading: boolean;

  private routeSubscription: Subscription;
  private accountSubscription: Subscription;
  private id: number;

  account$: BehaviorSubject<Account>;
  updateMode: boolean;

  constructor(private fb: FormBuilder,
    private accountsService: AccountsService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {

      this.initForm();

      if (params['id'] !== undefined) {
        this.id = +params['id'];
        this.updateMode = true;
        this.initUpdateMode(this.id);
      }
    });

  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    if (this.updateMode) {
      this.accountSubscription.unsubscribe();
    }
  }

  initForm() {
    this.header = 'Add an account'
    this.button = 'Add new account';
    this.accountName = this.fb.control('', Validators.compose([Validators.required]));
    this.accountNumber = this.fb.control('', Validators.pattern('^[0-9]+$'));
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

  initUpdateMode(idAccount: number) {
    this.header = 'Update an account'
    this.button = 'Update account';
    this.account$ = this.accountsService.account$;
    this.accountSubscription = this.account$.subscribe((account: Account) => {
      if (account !== null) {
        this.accountName.setValue(account.name);
        this.accountNumber.setValue(account.number);
        this.username.setValue(account.username);
        this.password.setValue(account.password);
        this.notes.setValue(account.notes);

        let tagsValue = '';
        const accountTagsWithoutName = account.tags.filter((tag) => tag !== account.name);
        accountTagsWithoutName.forEach((tag: string) => {
          tagsValue = tagsValue.concat(tag + ', ');
        });

        this.tags.setValue(tagsValue.slice(0, -2));
      }
    });
    this.accountsService.getAccount(idAccount);
  }

  onSubmitNewAccount() {
    // Creating new account
    const newAccount = new Account(this.username.value, this.password.value, this.accountName.value);
    newAccount.number = this.accountNumber.value;
    newAccount.notes = this.notes.value;
    // If not tag we don't split anything
    if (this.tags.value !== '') {
      newAccount.tags = this.tags.value.trim().split(',');
    }
    newAccount.tags.push(this.accountName.value);
    // Regex to keep the space between word and delete the outer one
    newAccount.tags.forEach((tag, index) => newAccount.tags[index] = tag.replace(/^\s+|\s+$|\s+(?=\s)/g, ''));

    this.loading = true;
    if (this.updateMode) {
      newAccount.id = this.id;
      this.accountsService.updateAccount(newAccount);
      this.loading = false;
      this.router.navigate(['accounts']);
    } else {
      this.accountsService.saveNewAccount(newAccount)
        .subscribe((accountsUpdated: AccountsDB) => {
          this.loading = false;
          this.router.navigate(['accounts']);
        },
        (error) => this.loading = false);
    }
  }
}

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountsDB} from './../../entities/accounts-db/accounts-db.model';
import {AccountsService} from './../../shared/account/accounts.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Account} from '../../shared/account/account.model';
import {isUndefined} from 'util';
import {Custom} from '../../shared/account/custom-account.model';
import {MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SnackComponent} from '../../shared/snack/snack.component';
import {AddCustomBlockComponent} from "./add-custom-block/add-custom-block.component";
import {Payment} from "../../shared/account/payment-block.model";
import {DisplayValuesPayment} from "./payment-custom-block/payment-custom-block.component";

@Component({
    selector: 'jhi-accountsdb-add',
    templateUrl: './accountsdb-add.component.html',
    styleUrls: ['./accountsdb-add.component.scss']
})
export class AccountsdbAddComponent implements OnInit, OnDestroy {

    accountForm: FormGroup;
    accountName: FormControl;
    accountNumber: FormControl;
    username: FormControl;
    password: FormControl;
    notes: FormControl;
    tags: FormControl;
    url: FormControl;
    customs: FormArray;

    maxName = 40;
    maxNumber = 50;
    maxLogin = 50;
    maxPassword = 50;
    maxNotes = 1000;
    maxTags = 100;
    maxKey = 60;
    maxValue = 100;
    maxUrl = 100;

    loading: boolean;

    private routeSubscription: Subscription;
    private accountSubscription: Subscription;
    private id: number;

    account$: BehaviorSubject<Account>;
    updateMode: boolean;

    passwordType: string;
    iconPasswordType: string;
    private customBlockDialog: MatDialogRef<AddCustomBlockComponent>;
    private payments: Array<Payment>;

    private customBlockCounter: {
        paymentBlocks: Array<number>;
    };

    constructor(private fb: FormBuilder,
                private accountsService: AccountsService,
                private router: Router,
                private route: ActivatedRoute,
                private snackBar: MatSnackBar,
                private translateService: TranslateService,
                public dialog: MatDialog) {
        this.customBlockCounter = {paymentBlocks: []};
    }

    ngOnInit() {
        this.initForm();
        this.initPasswordHideDisplay();
        this.routeSubscription = this.route.params.subscribe((params) => {

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
        this.accountName = this.fb.control('', Validators.compose([Validators.required, Validators.maxLength(this.maxName)]));
        this.accountNumber = this.fb.control('', Validators.maxLength(this.maxNumber));
        this.username = this.fb.control('', Validators.compose([Validators.required, Validators.maxLength(this.maxLogin)]));
        this.password = this.fb.control('', Validators.compose([Validators.required, Validators.maxLength(this.maxPassword)]));
        this.notes = this.fb.control('', Validators.maxLength(this.maxNotes));
        this.tags = this.fb.control('', Validators.maxLength(this.maxTags));
        this.url = this.fb.control('', Validators.pattern('https?://.+'));
        this.customs = this.fb.array([]);

        this.accountForm = this.fb.group({
            accountName: this.accountName,
            accountNumber: this.accountNumber,
            username: this.username,
            password: this.password,
            url: this.url,
            notes: this.notes,
            tags: this.tags,
            customs: this.customs
        });
    }

    initUpdateMode(idAccount: number) {
        this.account$ = this.accountsService.account$;
        this.accountSubscription = this.account$.subscribe((account: Account) => {
            if (account !== null) {
                this.accountName.setValue(account.name);
                this.accountNumber.setValue(account.number);
                this.username.setValue(account.username);
                this.password.setValue(account.password);
                this.notes.setValue(account.notes);
                this.url.setValue(account.url);

                this.customs.controls.splice(0, this.customs.controls.length);
                account.customs.forEach((custom) => this.addCustomField(custom.key, custom.value));

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
        newAccount.url = this.url.value;
        newAccount.number = this.accountNumber.value;
        newAccount.notes = this.notes.value;
        if (!isUndefined(this.payments) && this.payments.length != 0) {
            this.payments.forEach((payment, index) => {

                if (payment.notes === DisplayValuesPayment.placeholderValueNotes) {
                    payment.notes = '';
                }

                if (payment.code === DisplayValuesPayment.placeholderValueCode) {
                    payment.code = '';
                }

                if (payment.method === DisplayValuesPayment.placeholderValueMethod) {
                    payment.method = '';
                }

                this.payments[index] = payment;
            });
        }

        // If no tag we don't split anything
        if (this.tags.value !== '') {
            newAccount.tags = this.tags.value.trim().split(',');
        }
        newAccount.tags.push(this.accountName.value);
        // Regex to keep the space between word and delete the outer one
        newAccount.tags.forEach((tag, index) => newAccount.tags[index] = tag.replace(/^\s+|\s+$|\s+(?=\s)/g, ''));

        this.customs.controls.forEach((group: FormGroup) => {
            const key = group.get('keyField').value;
            const value = group.get('valueField').value;

            if (!isUndefined(key) && key !== '' && !isUndefined(value) && value !== '') {
                const newCustom = new Custom(key, value);
                newAccount.customs.push(newCustom);
            }
        });

        this.loading = true;
        if (this.updateMode) {
            newAccount.id = this.id;
            this.accountsService.updateAccount(newAccount);
            this.loading = false;
            this.router.navigate(['accounts']);
        } else {
            this.accountsService.saveNewAccount(newAccount)
                .subscribe((accountsUpdated: AccountsDB) => {
                        const message = this.translateService.instant('ninjaccountApp.accountsDB.add.successful');
                        const config = new MatSnackBarConfig();
                        config.verticalPosition = 'top';
                        config.duration = 3000;
                        config.data = {icon: 'fa-check-circle-o', text: message}
                        this.snackBar.openFromComponent(SnackComponent, config);

                        this.loading = false;
                        this.router.navigate(['accounts']);
                    },
                    (error) => {
                        let message;
                        let urlSettings;
                        let actionSettings;
                        if (!error.ok && error.status === 400) {
                            message = this.translateService.instant('ninjaccountApp.accountsDB.add.toomanyAccount');
                            urlSettings = '/settings';
                            actionSettings = 'Settings';
                        } else {
                            message = this.translateService.instant('ninjaccountApp.accountsDB.add.error');
                        }
                        this.loading = false;
                        this.accountsService.rollingAddedAccount(newAccount);
                        const config = new MatSnackBarConfig();
                        config.verticalPosition = 'top';
                        config.duration = 15000;
                        config.data = {
                            icon: 'fa-exclamation-triangle',
                            text: message,
                            url: urlSettings,
                            action: actionSettings
                        }
                        this.snackBar.openFromComponent(SnackComponent, config);
                    });
        }
    }

    addCustomField(key: string, value: string) {
        const custom = this.fb.group({
            keyField: new FormControl(key, Validators.maxLength(this.maxKey)),
            valueField: new FormControl(value, Validators.maxLength(this.maxValue))
        });

        this.customs.push(custom);
    }

    onDeleteCustomField(index: number) {
        this.customs.controls.splice(index, 1);
    }

    initPasswordHideDisplay() {
        this.passwordType = 'password';
        this.iconPasswordType = 'fa-eye-slash'
    }

    onHideDisplayPassword() {
        if (this.passwordType === 'password') {
            this.passwordType = 'text';
            this.iconPasswordType = 'fa-eye'
        } else {
            this.passwordType = 'password';
            this.iconPasswordType = 'fa-eye-slash'
        }
    }

    openCustomBlock() {
        this.customBlockDialog = this.dialog.open(AddCustomBlockComponent);
        this.onCloseCustomBlockPopup();
    }

    onCloseCustomBlockPopup() {
        this.customBlockDialog.afterClosed().subscribe(blockToAdd => {
            if (!isUndefined(blockToAdd)) {
                if (blockToAdd.paymentBlocks) {
                    console.log('Adding one payment block !!');
                    this.customBlockCounter.paymentBlocks.push(1);
                    console.log('Total number of payment block : ' + this.customBlockCounter.paymentBlocks.length);
                }
            }
        });
    }

    onSyncPayments(payments: Array<Payment>) {
        this.payments = payments;
        console.log('payments: ' + this.payments.length);
        this.payments.forEach((payment) => console.log(payment.code));
    }
}

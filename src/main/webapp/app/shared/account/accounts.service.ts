import {AccountsTechService} from './accounts-tech.service';
import {Observable} from 'rxjs/Rx';
import {CryptoUtilsService} from '../crypto/crypto-utils.service';
import {AccountsDB} from '../../entities/accounts-db/accounts-db.model';
import {Account} from './account.model';
import {Accounts} from './accounts.model';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Version} from './version.enum';
import {OperationAccountType} from './operation-account-type.enum';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {SnackComponent} from '../snack/snack.component';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class AccountsService {

    accounts$: BehaviorSubject<Array<Account>>;
    account$: BehaviorSubject<Account>;
    featuredAccounts$: BehaviorSubject<Array<Account>>;

    private _dataStore: {
        accounts: Accounts
    };

    constructor(private cryptoUtils: CryptoUtilsService,
                private accountTech: AccountsTechService,
                private translateService: TranslateService,
                private snackBar: MatSnackBar) {
        this._dataStore = {accounts: new Accounts()};

        this.accounts$ = new BehaviorSubject<Array<Account>>(this._dataStore.accounts.accounts);
        this.account$ = new BehaviorSubject<Account>(null);
        this.featuredAccounts$ = new BehaviorSubject<Array<Account>>(new Array<Account>());
    }

    getAccount(id: number) {
        if (this._dataStore.accounts.accounts.length === 0) {
            this.accountTech.synchroDB().subscribe((accountsFromDB) => {
                this._dataStore.accounts = accountsFromDB;
                const accounts = this._dataStore.accounts.accounts.filter((account) => account.id === id);
                this.account$.next(accounts[0]);
            });
        } else {
            const accounts = this._dataStore.accounts.accounts.filter((account) => account.id === id);
            this.account$.next(accounts[0]);
        }
    }

    getAccountsList() {
        if (this._dataStore.accounts.accounts.length === 0) {
            this.accountTech.synchroDB().subscribe((accountsFromDB) => {
                this._dataStore.accounts = accountsFromDB;
                this.accounts$.next(this._dataStore.accounts.accounts);
            });
        } else {
            this.accounts$.next(this._dataStore.accounts.accounts);
        }
    }

    getAccountsListInstant(): Array<Account> {
        return this._dataStore.accounts.accounts;
    }

    getFeaturedAccountsList() {
        if (this._dataStore.accounts.accounts.length === 0) {
            this.accountTech.synchroDB().subscribe((accountsFromDB) => {
                this._dataStore.accounts = accountsFromDB;
                this.featuredAccounts$.next(this._dataStore.accounts.accounts.filter((account) => account.featured));
            });
        } else {
            this.featuredAccounts$.next(this._dataStore.accounts.accounts.filter((account) => account.featured));
        }
    }

    addOrRemoveFeatured(accountToFeatured: Account, featuredOrNot: boolean) {
        this._dataStore.accounts.accounts.forEach((account) => {
            if (account.id === accountToFeatured.id) {
                if (featuredOrNot) {
                    account.featured = true;
                } else {
                    account.featured = false;
                }
                this.updateAccount(account);
            }
        });
        this.featuredAccounts$.next(this._dataStore.accounts.accounts.filter((account) => account.featured));
    }

    init(): Accounts {
        const accountsInitialized = new Accounts();
        accountsInitialized.version = Version.V1_0;
        accountsInitialized.authenticationKey = this.getRandomString(22);

        return accountsInitialized;
    }

    seqNextVal(accounts: Accounts): number {
        const accountsIds = accounts.accounts.map((account) => account.id);
        if (accountsIds.length === 0) {
            return 1;
        } else {
            return Math.max.apply(null, accountsIds) + 1;
        }
    }

    getRandomString(length: number) {
        let text = '';
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return text;
    }

    saveOnBrowser(accounts: Accounts) {
        accounts.operationAccountType = null;
        this._dataStore.accounts = accounts;
        this.accounts$.next(this._dataStore.accounts.accounts);
    }

    saveNewAccount(account: Account | Array<Account>): Observable<AccountsDB> {
        return this.accountTech.synchroDB()
            .flatMap((accounts: Accounts) => {
                const initVector = this.cryptoUtils.getRandomNumber();
                if (account instanceof Account) {
                    // Sequence management
                    account.id = this.seqNextVal(this._dataStore.accounts);
                    // Adding new account
                    accounts.accounts.push(account);
                } else {
                    for (const newAccount of account) {
                        newAccount.id = this.seqNextVal(this._dataStore.accounts);
                        this._dataStore.accounts.accounts.push(newAccount);
                        accounts.accounts.push(newAccount);
                    }
                }
                this.saveOnBrowser(accounts);
                accounts.operationAccountType = OperationAccountType.CREATE;
                return this.accountTech.saveEncryptedDB(accounts, initVector);
            });
    }

    updateAccount(accountUpdated: Account) {
        const initVector = this.cryptoUtils.getRandomNumber();
        this.accountTech.synchroDB()
            .flatMap((accounts: Accounts) => {
                for (let _i = 0; _i < accounts.accounts.length; _i++) {
                    const account = accounts.accounts[_i];
                    if (account.id === accountUpdated.id) {
                        this.copyAccount(accounts.accounts[_i], accountUpdated);
                        this.copyAccount(this._dataStore.accounts.accounts[_i], accountUpdated);
                    }
                }
                this.saveOnBrowser(accounts);
                accounts.operationAccountType = OperationAccountType.UPDATE;
                return this.accountTech.saveEncryptedDB(accounts, initVector);
            }).subscribe((accountDB: AccountsDB) => {
                this.accounts$.next(this._dataStore.accounts.accounts);
            },
            (error) => {
                this.errorSnack('ninjaccountApp.accountsDB.update.error');
            });

    }

    clean(): void {
        this._dataStore.accounts = new Accounts();
        this.accounts$.next(this._dataStore.accounts.accounts);
    }

    deleteAccount(accountId: number) {
        const initVector = this.cryptoUtils.getRandomNumber();
        this.accountTech.synchroDB()
            .flatMap((accounts: Accounts) => {
                accounts.accounts = accounts.accounts.filter((account) => account.id !== accountId);
                this.deleteLocalAccount(accountId);
                accounts.operationAccountType = OperationAccountType.DELETE;
                return this.accountTech.saveEncryptedDB(accounts, initVector);
            }).subscribe((accountDB: AccountsDB) => {
                this.accounts$.next(this._dataStore.accounts.accounts);
                this.featuredAccounts$.next(this._dataStore.accounts.accounts.filter((account) => account.featured));
            },
            (error) => {
                this.errorSnack('ninjaccountApp.accountsDB.delete.error');
            });
    }

    deleteLocalAccount(accountId: number) {
        this._dataStore.accounts.accounts = this._dataStore.accounts.accounts.filter((account) => account.id !== accountId);
        this.saveOnBrowser(this._dataStore.accounts);
    }

    copyAccount(target: Account, source: Account) {
        target.name = source.name;
        target.number = source.number;
        target.username = source.username;
        target.password = source.password;
        target.notes = source.notes;
        target.tags = source.tags;
        target.customs = source.customs;
        target.featured = source.featured;
        target.url = source.url;
        target.payments = source.payments;
    }

    rollingAddedAccount(account: Account): void {
        this.deleteLocalAccount(account.id);
        this.accounts$.next(this._dataStore.accounts.accounts);
    }

    errorSnack(key: string) {
        const message = this.translateService.instant(key);
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.duration = 10000;
        config.data = {icon: 'fa-exclamation-triangle', text: message};
        this.snackBar.openFromComponent(SnackComponent, config);
    }
}

import { AccountsTechService } from './accounts-tech.service';
import { Observable } from 'rxjs/Rx';
import { SessionStorageService } from 'ng2-webstorage';
import { CryptoUtilsService } from '../crypto/crypto-utils.service';
import { AccountsDB } from '../../entities/accounts-db/accounts-db.model';
import { Account } from './account.model';
import { Accounts } from './accounts.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AccountsService {

    accounts$: BehaviorSubject<Array<Account>>;
    account$: BehaviorSubject<Account>;

    private _dataStore: {
        accounts: Accounts
    };

    constructor(private cryptoUtils: CryptoUtilsService,
        private sessionStorage: SessionStorageService,
        private accountTech: AccountsTechService) {

        this._dataStore = { accounts: new Accounts() };

        this.accounts$ = new BehaviorSubject<Array<Account>>(this._dataStore.accounts.accounts);
        this.account$ = new BehaviorSubject<Account>(null);
    }

    getAccount(id: number) {
        if (this._dataStore.accounts.accounts.length === 0) {
            this._dataStore.accounts = JSON.parse(this.sessionStorage.retrieve('accountsdb'));
        }
        const accounts = this._dataStore.accounts.accounts.filter((account) => account.id === id);
        this.account$.next(accounts[0]);
    }

    getAccountsList() {
        if (this._dataStore.accounts.accounts.length === 0) {
            this._dataStore.accounts = JSON.parse(this.sessionStorage.retrieve('accountsdb'));
        }
        this.accounts$.next(this._dataStore.accounts.accounts);
    }

    init(): Accounts {
        const accountsInitialized = new Accounts();
        accountsInitialized.authenticationKey = this.getRandomString(22);
        const sampleAccount = new Account('dupont', 'password', 'example', this.seqNextVal(accountsInitialized));
        sampleAccount.tags.push('title');
        accountsInitialized.accounts.push(sampleAccount);

        return accountsInitialized;
    }

    seqNextVal(accounts: Accounts): number {
        accounts.seq += 1;
        return accounts.seq;
    }

    getRandomString(length: number) {
        let text = ''
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return text;
    }

    saveOnBrowser(accounts: Accounts) {
        this.sessionStorage.store('accountsdb', JSON.stringify(accounts));
        this._dataStore.accounts = accounts;
        this.accounts$.next(this._dataStore.accounts.accounts);
    }

    saveNewAccount(account: Account): Observable<AccountsDB> {
        // Sequence management
        account.id = this.seqNextVal(this._dataStore.accounts);
        const initVector = this.cryptoUtils.getRandomNumber();
        return this.accountTech.synchroDB()
            .flatMap((accounts: Accounts) => {
                // Adding nen account
                accounts.accounts.push(account);
                // Sequence management
                accounts.seq = this._dataStore.accounts.seq;
                this.saveOnBrowser(accounts);
                return this.accountTech.saveEncryptedDB(accounts, initVector);
            });
    }

    updateAccount(accountUpdated: Account) {
        const initVector = this.cryptoUtils.getRandomNumber();
        return this.accountTech.synchroDB()
            .flatMap((accounts: Accounts) => {
                for (let _i = 0; _i < this._dataStore.accounts.accounts.length; _i++) {
                    const account = this._dataStore.accounts.accounts[_i];
                    if (account.id === accountUpdated.id) {
                        this.copyAccount(this._dataStore.accounts.accounts[_i], accountUpdated);
                    }
                }
                this.saveOnBrowser(this._dataStore.accounts);
                return this.accountTech.saveEncryptedDB(this._dataStore.accounts, initVector);
            }).subscribe((accountDB: AccountsDB) => {
                this.accounts$.next(this._dataStore.accounts.accounts);
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
                this._dataStore.accounts.accounts = this._dataStore.accounts.accounts.filter((account) => account.id !== accountId);
                this.saveOnBrowser(this._dataStore.accounts);
                return this.accountTech.saveEncryptedDB(this._dataStore.accounts, initVector);
            }).subscribe((accountDB: AccountsDB) => this.accounts$.next(this._dataStore.accounts.accounts));
    }

    copyAccount(target: Account, source: Account) {
        target.name = source.name;
        target.number = source.number;
        target.username = source.username;
        target.password = source.password;
        target.notes = source.notes;
        target.tags = source.tags;
    }
}

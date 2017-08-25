import { Observable } from 'rxjs/Rx';
import { SessionStorageService } from 'ng2-webstorage';
import { CryptoService } from '../crypto/crypto.service';
import { CryptoUtilsService } from '../crypto/crypto-utils.service';
import { AccountsDB } from '../../entities/accounts-db/accounts-db.model';
import { AccountsDBService } from '../../entities/accounts-db/accounts-db.service';
import { Account } from './account.model';
import { Accounts } from './accounts.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AccountsService {

    accounts$: BehaviorSubject<Array<Account>>;

    private _dataStore: {
        accounts: Accounts
    };

    constructor(private accountsDBService: AccountsDBService,
        private cryptoUtils: CryptoUtilsService,
        private sessionStorage: SessionStorageService,
        private crypto: CryptoService) {

        this._dataStore = { accounts: new Accounts() };

        this.accounts$ = new BehaviorSubject<Array<Account>>(this._dataStore.accounts.accounts);
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
        const sampleAccount = new Account('username', 'password', 'title');
        sampleAccount.tags.push('title');
        accountsInitialized.accounts.push(sampleAccount);

        return accountsInitialized;
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
        let accountDbDtoOut = null;
        const initVector = this.cryptoUtils.getRandomNumber();
        return this.accountsDBService.getDbUserConnected()
            .flatMap((accountDbDto: AccountsDB) => {
                accountDbDtoOut = accountDbDto;
                return this.decryptWithKeyInStorage(accountDbDto)
            })
            .flatMap((accounts: Accounts) => {
                accounts.accounts.push(account);
                this.saveOnBrowser(accounts);
                return this.encryptWithKeyInStorage(accounts, initVector);
            })
            .flatMap((accountDB: ArrayBuffer) => this.saveEncryptedDB(accountDB, initVector, accountDbDtoOut.id));
    }

    saveEncryptedDB(accountDB: ArrayBuffer, initVector: string, idAccount: number): Observable<AccountsDB> {
        return Observable.fromPromise(this.cryptoUtils.toBase64Promise(new Blob([new Uint8Array(accountDB)], { type: 'application/octet-stream' })))
            .flatMap((accountDBbase64: string) => {
                const accountDBDTO = new AccountsDB();
                accountDBDTO.database = accountDBbase64;
                accountDBDTO.databaseContentType = 'application/octet-stream';
                accountDBDTO.initializationVector = initVector;
                return this.accountsDBService.updateDBUserConnected(accountDBDTO);
            });
    }

    decryptWithKeyInStorage(accountDbDto: AccountsDB): Observable<Accounts> {
        let accountDBArrayBufferOut = null;
        return Observable
            .of(this.cryptoUtils.b64toBlob(accountDbDto.database, 'application/octet-stream', 2048))
            .flatMap((accountDBBlob: Blob) => this.cryptoUtils.blobToArrayBuffer(accountDBBlob))
            .flatMap((accountDBArrayBuffer) => {
                accountDBArrayBufferOut = accountDBArrayBuffer;
                return this.crypto.getCryptoKeyInStorage()
            })
            .flatMap((cryptoKey: CryptoKey) => {
                return this.crypto.decrypt(accountDbDto.initializationVector, cryptoKey, accountDBArrayBufferOut)
            })
            .flatMap((decryptedDB: ArrayBuffer) => {
                return Observable.of(this.cryptoUtils.arrayBufferToAccounts(decryptedDB));
            });
    }

    encryptWithKeyInStorage(accounts: Accounts, initVector: string): Observable<ArrayBuffer> {
        return this.crypto.getCryptoKeyInStorage()
            .flatMap((cryptoKey: CryptoKey) => this.crypto.cryptingDB(initVector, accounts, cryptoKey));
    }

}

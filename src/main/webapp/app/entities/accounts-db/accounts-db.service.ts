import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../../app.constants';
import { AccountsDB, IAccountsDB } from '../../shared/model/accounts-db.model';
import { BehaviorSubject } from 'rxjs';
import { Accounts } from '../../shared/account/accounts.model';
import { CryptoService } from '../../shared/crypto/crypto.service';
import { createRequestOption } from '../../shared/util/request-util';
import { SnackComponent } from 'app/shared/snack/snack.component';
import { Version } from 'app/shared/account/version.enum';
import { Account } from 'app/shared/account/account.model';
import { OperationAccountType } from 'app/shared/account/operation-account-type.enum';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

type EntityResponseType = HttpResponse<IAccountsDB>;
type EntityArrayResponseType = HttpResponse<IAccountsDB[]>;

@Injectable({ providedIn: 'root' })
export class AccountsDBService {
    private resourceUrl = SERVER_API_URL + 'api/accounts-dbs';

    actualAndMaxNumber$: BehaviorSubject<any>;
    accounts$: BehaviorSubject<Array<Account>>;
    account$: BehaviorSubject<Account>;

    private _dataStore: {
        actualNunberAccount: number;
        maxNumberAccount: number;
        accounts: Accounts;
    };

    constructor(
        private http: HttpClient,
        private crypto: CryptoService,
        private translateService: TranslateService,
        private snackBar: MatSnackBar
    ) {
        this._dataStore = {
            actualNunberAccount: 0,
            maxNumberAccount: 10,
            accounts: new Accounts()
        };
        this.actualAndMaxNumber$ = new BehaviorSubject<any>({ first: 0, second: 10 });
        this.accounts$ = new BehaviorSubject<Array<Account>>(this._dataStore.accounts.accounts);
        this.account$ = new BehaviorSubject<Account>(null);
    }

    create(accountsDB: IAccountsDB): Observable<EntityResponseType> {
        return this.http.post<IAccountsDB>(this.resourceUrl, accountsDB, { observe: 'response' });
    }

    update(accountsDB: IAccountsDB): Observable<EntityResponseType> {
        return this.http.put<IAccountsDB>(this.resourceUrl, accountsDB, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IAccountsDB>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IAccountsDB[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    /**
     * Convert a AccountsDB to a JSON which can be sent to the server.
     */
    private convert(accountsDB: AccountsDB): AccountsDB {
        const copy: AccountsDB = Object.assign({}, accountsDB);
        return copy;
    }

    updateDBUserConnected(accountsDB: AccountsDB): Observable<AccountsDB> {
        const copy = this.convert(accountsDB);
        return this.http
            .put<IAccountsDB>(`${this.resourceUrl}/updateDbUserConnected`, copy, { observe: 'response' })
            .map((res: EntityResponseType) => {
                if (res.ok) {
                    return res.body;
                } else {
                    // return Observable.throw(res.statusText);
                }
            });
    }

    getActualMaxAccount() {
        this.http
            .get(SERVER_API_URL + 'api/accounts-dbs/get-actual-max-account', { observe: 'response' })
            .map((res: EntityResponseType) => res.body)
            .subscribe((actualAndMax: any) => {
                this._dataStore.actualNunberAccount = actualAndMax.first;
                this._dataStore.maxNumberAccount = actualAndMax.second;
                this.actualAndMaxNumber$.next(actualAndMax);
            });
    }

    updateActualNumberAccount(newActualNumberAccount: number): Observable<EntityResponseType> {
        return this.http
            .post<IAccountsDB>(`${this.resourceUrl}/update-actual-number-account`, newActualNumberAccount, { observe: 'response' })
            .map((res: EntityResponseType) => res);
    }

    saveEncryptedDB(accounts: Accounts, initVector: string): Observable<AccountsDB> {
        const accountDBDTO = new AccountsDB();
        return this.encryptWithKeyInStorage(accounts, initVector)
            .flatMap((accountDB: ArrayBuffer) =>
                this.crypto.toBase64Promise(new Blob([new Uint8Array(accountDB)], { type: 'application/octet-stream' }))
            )
            .flatMap((accountDBbase64: string) => {
                accountDBDTO.database = accountDBbase64;
                accountDBDTO.databaseContentType = 'application/octet-stream';
                accountDBDTO.initializationVector = initVector;
                accountDBDTO.operationAccountType = accounts.operationAccountType;
                return this.crypto.generateChecksum(accountDBDTO.database);
            })
            .flatMap((sum: string) => {
                accountDBDTO.sum = sum;
                return this.updateDBUserConnected(accountDBDTO);
            });
    }

    encryptWithKeyInStorage(accounts: Accounts, initVector: string): Observable<ArrayBuffer> {
        return this.crypto
            .getCryptoKeyInStorage()
            .flatMap((cryptoKey: CryptoKey) => this.crypto.cryptingDB(initVector, accounts, cryptoKey));
    }

    getDbUserConnected(): Observable<AccountsDB> {
        return this.http
            .get<IAccountsDB>(`${this.resourceUrl}/getDbUserConnected`, { observe: 'response' })
            .map((res: EntityResponseType) => {
                return res.body;
            });
    }

    getAccount(id: number) {
        if (this._dataStore.accounts.accounts.length === 0) {
            this.synchroDB().subscribe(accountsFromDB => {
                this._dataStore.accounts = accountsFromDB;
                const accounts = this._dataStore.accounts.accounts.filter(account => account.id === id);
                this.account$.next(accounts[0]);
            });
        } else {
            const accounts = this._dataStore.accounts.accounts.filter(account => account.id === id);
            this.account$.next(accounts[0]);
        }
    }

    getAccountsList() {
        if (this._dataStore.accounts.accounts.length === 0) {
            this.synchroDB().subscribe(accountsFromDB => {
                this._dataStore.accounts = accountsFromDB;
                this.sortAccountByName();
                this.accounts$.next(this._dataStore.accounts.accounts);
            });
        } else {
            this.accounts$.next(this._dataStore.accounts.accounts);
        }
    }

    private sortAccountByName() {
        this._dataStore.accounts.accounts.sort((accountA, accountB) => {
            const nameA = accountA.name.toLowerCase();
            const nameB = accountB.name.toLowerCase();
            if (nameA < nameB) {
                // sort string ascending
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0; // default return value (no sorting)
        });
    }

    getAccountsListInstant(): Array<Account> {
        return this._dataStore.accounts.accounts;
    }

    init(): Accounts {
        const accountsInitialized = new Accounts();
        accountsInitialized.version = Version.V1_0;
        accountsInitialized.authenticationKey = this.getRandomString(22);

        return accountsInitialized;
    }

    seqNextVal(accounts: Accounts): number {
        const accountsIds = accounts.accounts.map(account => account.id);
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
        return this.synchroDB().flatMap((accounts: Accounts) => {
            const initVector = this.crypto.getRandomNumber();
            if (account instanceof Account) {
                // Sequence management
                account.id = this.seqNextVal(this._dataStore.accounts);
                // Adding new account
                accounts.accounts.push(account);
            } else {
                for (const newAccount of account) {
                    newAccount.id = this.seqNextVal(this._dataStore.accounts);
                    this._dataStore.accounts.accounts.push(newAccount);
                    this.sortAccountByName();
                    accounts.accounts.push(newAccount);
                }
            }
            this.saveOnBrowser(accounts);
            accounts.operationAccountType = OperationAccountType.CREATE;
            return this.saveEncryptedDB(accounts, initVector);
        });
    }

    updateAccount(accountUpdated: Account) {
        const initVector = this.crypto.getRandomNumber();
        this.synchroDB()
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
                return this.saveEncryptedDB(accounts, initVector);
            })
            .subscribe(
                (accountDB: AccountsDB) => {
                    this.sortAccountByName();
                    this.accounts$.next(this._dataStore.accounts.accounts);
                },
                error => {
                    this.errorSnack('ninjaccountApp.accountsDB.update.error');
                }
            );
    }

    clean(): void {
        this._dataStore.accounts = new Accounts();
        this.accounts$.next(this._dataStore.accounts.accounts);
    }

    deleteAccount(accountId: number) {
        const initVector = this.crypto.getRandomNumber();
        this.synchroDB()
            .flatMap((accounts: Accounts) => {
                accounts.accounts = accounts.accounts.filter(account => account.id !== accountId);
                this.deleteLocalAccount(accountId);
                accounts.operationAccountType = OperationAccountType.DELETE;
                return this.saveEncryptedDB(accounts, initVector);
            })
            .subscribe(
                (accountDB: AccountsDB) => {
                    this.accounts$.next(this._dataStore.accounts.accounts);
                },
                error => {
                    this.errorSnack('ninjaccountApp.accountsDB.delete.error');
                }
            );
    }

    deleteLocalAccount(accountId: number) {
        this._dataStore.accounts.accounts = this._dataStore.accounts.accounts.filter(account => account.id !== accountId);
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
        config.data = { icon: 'fa-exclamation-triangle', text: message };
        this.snackBar.openFromComponent(SnackComponent, config);
    }

    resetEntireDB() {
        const initVector = this.crypto.getRandomNumber();
        this.synchroDB()
            .flatMap((accounts: Accounts) => {
                accounts.accounts.splice(0, accounts.accounts.length);
                accounts.operationAccountType = OperationAccountType.DELETE_ALL;
                this._dataStore.accounts = accounts;
                return this.saveEncryptedDB(accounts, initVector);
            })
            .subscribe(
                (accountDB: AccountsDB) => {
                    //this.accountDbService.getActualMaxAccount();
                    this.saveOnBrowser(this._dataStore.accounts);
                },
                error => {
                    this.errorSnack('ninjaccountApp.accountsDB.delete.error');
                }
            );
    }

    synchroDB(): Observable<Accounts> {
        return this.getDbUserConnected()
            .flatMap((accountDbDto: AccountsDB) => this.decryptWithKeyInStorage(accountDbDto))
            .flatMap((accounts: Accounts) => Observable.of(accounts));
    }

    decryptWithKeyInStorage(accountDbDto: AccountsDB): Observable<Accounts> {
        let accountDBArrayBufferOut = null;
        return Observable.of(this.crypto.b64toBlob(accountDbDto.database, 'application/octet-stream', 2048))
            .flatMap((accountDBBlob: Blob) => this.crypto.blobToArrayBuffer(accountDBBlob))
            .flatMap(accountDBArrayBuffer => {
                accountDBArrayBufferOut = accountDBArrayBuffer;
                return this.crypto.getCryptoKeyInStorage();
            })
            .flatMap((cryptoKey: CryptoKey) => {
                return this.crypto.decrypt(accountDbDto.initializationVector, cryptoKey, accountDBArrayBufferOut);
            })
            .flatMap((decryptedDB: ArrayBuffer) => {
                return Observable.of(this.crypto.arrayBufferToAccounts(decryptedDB));
            });
    }
}

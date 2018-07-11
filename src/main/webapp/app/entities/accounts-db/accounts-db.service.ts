import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { AccountsDB, IAccountsDB } from 'app/shared/model/accounts-db.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Accounts } from 'app/shared/account/accounts.model';
import { CryptoService } from 'app/shared/crypto/crypto.service';

type EntityResponseType = HttpResponse<IAccountsDB>;
type EntityArrayResponseType = HttpResponse<IAccountsDB[]>;

@Injectable({ providedIn: 'root' })
export class AccountsDBService {
    private resourceUrl = SERVER_API_URL + 'api/accounts-dbs';

    actualAndMaxNumber$: BehaviorSubject<any>;

    private _dataStore: {
        actualNunberAccount: number;
        maxNumberAccount: number;
    };

    constructor(private http: HttpClient, private crypto: CryptoService) {
        this._dataStore = {
            actualNunberAccount: 0,
            maxNumberAccount: 10
        };
        this.actualAndMaxNumber$ = new BehaviorSubject<any>({ first: 0, second: 10 });
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

    getDbUserConnected(): Observable<AccountsDB> {
        return this.http.get(`${this.resourceUrl}/getDbUserConnected`, { observe: 'response' }).map((res: HttpResponse<AccountsDB>) => {
            return res.body;
        });
    }

    updateDBUserConnected(accountsDB: AccountsDB): Observable<AccountsDB> {
        const copy = this.convert(accountsDB);
        return this.http.put(`${this.resourceUrl}/updateDbUserConnected`, copy, { observe: 'response' }).map((res: EntityResponseType) => {
            if (res.ok) {
                return this.convertResponse(res).body;
            } else {
                // return Observable.throw(res.statusText);
            }
        });
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AccountsDB = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    /**
     * Convert a returned JSON object to AccountsDB.
     */
    private convertItemFromServer(accountsDB: AccountsDB): AccountsDB {
        const copy: AccountsDB = Object.assign({}, accountsDB);
        return copy;
    }

    getActualMaxAccount() {
        this.http
            .get(SERVER_API_URL + 'api/accounts-dbs/get-actual-max-account', { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res).body)
            .subscribe((actualAndMax: any) => {
                this._dataStore.actualNunberAccount = actualAndMax.first;
                this._dataStore.maxNumberAccount = actualAndMax.second;
                this.actualAndMaxNumber$.next(actualAndMax);
            });
    }

    updateActualNumberAccount(newActualNumberAccount: number): Observable<EntityResponseType> {
        return this.http
            .post<AccountsDB>(`${this.resourceUrl}/update-actual-number-account`, newActualNumberAccount, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    synchroDB(): Observable<Accounts> {
        return this.getDbUserConnected()
            .flatMap((accountDbDto: AccountsDB) => this.decryptWithKeyInStorage(accountDbDto))
            .flatMap((accounts: Accounts) => Observable.of(accounts));
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
            .flatMap(sum => {
                accountDBDTO.sum = sum;
                return this.updateDBUserConnected(accountDBDTO);
            });
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

    encryptWithKeyInStorage(accounts: Accounts, initVector: string): Observable<ArrayBuffer> {
        return this.crypto
            .getCryptoKeyInStorage()
            .flatMap((cryptoKey: CryptoKey) => this.crypto.cryptingDB(initVector, accounts, cryptoKey));
    }
}

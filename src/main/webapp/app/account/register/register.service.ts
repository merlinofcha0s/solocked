import { CryptoUtilsService } from './../../shared/crypto/crypto-utils.service';
import { TextEncoder } from 'text-encoding';
import { JhiDataUtils } from 'ng-jhipster';
import { AccountsDBService } from './../../entities/accounts-db/accounts-db.service';
import { AccountsDB } from './../../entities/accounts-db/accounts-db.model';
import { CryptoService } from './../../shared/crypto/crypto.service';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AccountsService } from '../../shared/account/accounts.service';
import { Accounts } from '../../shared/account/accounts.model';

@Injectable()
export class Register {

    constructor(private http: Http, private accountService: AccountsService
        , private crypto: CryptoService, private accountDBService: AccountsDBService
        , private cryptoUtils: CryptoUtilsService) { }

    save(account: any): Observable<any> {
        // Generate the new DB
        const newAccountsDB = this.accountService.init();
        const passwordStorage = account.password;
        const initVector = this.cryptoUtils.getRandomNumber();

        return Observable
            .fromPromise(this.crypto.creatingKey(account.password))
            .flatMap((derivedCryptoKey) => this.crypto.cryptingDB(initVector, newAccountsDB, derivedCryptoKey))
            .flatMap((accountDB: ArrayBuffer) => this.cryptoUtils.toBase64Promise(new Blob([new Uint8Array(accountDB)], { type: 'application/octet-stream' })))
            .flatMap((accountDBbase64: string) => {
                const accountDBDTO = new AccountsDB();
                accountDBDTO.database = accountDBbase64;
                accountDBDTO.databaseContentType = 'application/octet-stream';
                accountDBDTO.initializationVector = initVector;
                account.password = newAccountsDB.authenticationKey;

                account.accountsDB = accountDBDTO;
                return this.http.post('api/register', account);
            });
    }
}

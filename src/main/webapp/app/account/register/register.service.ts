import { CryptoUtilsService } from './../../shared/crypto/crypto-utils.service';
import { AccountsDB } from './../../entities/accounts-db/accounts-db.model';
import { CryptoService } from './../../shared/crypto/crypto.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AccountsService } from '../../shared/account/accounts.service';

@Injectable()
export class Register {

    constructor(private http: Http, private accountService: AccountsService,
                private crypto: CryptoService,
                private cryptoUtils: CryptoUtilsService) { }

    save(account: any): Observable<any> {
        // Generate the new DB
        const newAccountsDB = this.accountService.init();
        const initVector = this.cryptoUtils.getRandomNumber();
        const accountDBDTO = new AccountsDB();
        return Observable
            .fromPromise(this.crypto.creatingKey(account.password))
            .flatMap((derivedCryptoKey) => this.crypto.cryptingDB(initVector, newAccountsDB, derivedCryptoKey))
            .flatMap((accountDB: ArrayBuffer) => this.cryptoUtils.toBase64Promise(new Blob([new Uint8Array(accountDB)], { type: 'application/octet-stream' })))
            .flatMap((accountDBbase64: string) => {
                accountDBDTO.database = accountDBbase64;
                accountDBDTO.databaseContentType = 'application/octet-stream';
                accountDBDTO.initializationVector = initVector;
                accountDBDTO.nbAccounts = 0;
                account.authenticationKey = newAccountsDB.authenticationKey;
                account.accountsDB = accountDBDTO;
                return this.crypto.generateChecksum(accountDBDTO.database);
            }).flatMap((sum) => {
                accountDBDTO.sum = sum;
                return this.http.post('api/register', account);
            });
    }
}

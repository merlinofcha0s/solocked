import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountsService } from 'app/shared/account/accounts.service';
import { CryptoUtilsService } from 'app/shared/crypto/crypto-utils.service';
import { CryptoService } from 'app/shared/crypto/crypto.service';
import { AccountsDB } from 'app/shared/model/accounts-db.model';

@Injectable({ providedIn: 'root' })
export class Register {
    constructor(
        private http: HttpClient,
        private accountService: AccountsService,
        private crypto: CryptoService,
        private cryptoUtils: CryptoUtilsService
    ) {}

    save(account: any): Observable<any> {
        // Generate the new DB
        const newAccountsDB = this.accountService.init();
        const initVector = this.cryptoUtils.getRandomNumber();
        const accountDBDTO = new AccountsDB();
        return Observable.fromPromise(this.crypto.creatingKey(account.password))
            .flatMap(derivedCryptoKey => this.crypto.cryptingDB(initVector, newAccountsDB, derivedCryptoKey))
            .flatMap((accountDB: ArrayBuffer) =>
                this.cryptoUtils.toBase64Promise(new Blob([new Uint8Array(accountDB)], { type: 'application/octet-stream' }))
            )
            .flatMap((accountDBbase64: string) => {
                accountDBDTO.database = accountDBbase64;
                accountDBDTO.databaseContentType = 'application/octet-stream';
                accountDBDTO.initializationVector = initVector;
                accountDBDTO.nbAccounts = 0;
                account.authenticationKey = newAccountsDB.authenticationKey;
                account.accountsDB = accountDBDTO;
                return this.crypto.generateChecksum(accountDBDTO.database);
            })
            .flatMap(sum => {
                accountDBDTO.sum = sum;
                return this.http.post('api/register', account, { observe: 'response' });
            });
    }
}

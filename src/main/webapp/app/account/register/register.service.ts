import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoService } from 'app/shared/crypto/crypto.service';
import { AccountsDBService } from 'app/entities/accounts-db';
import { AccountsDB } from 'app/shared/model/accounts-db.model';
import { SrpService } from 'app/entities/srp';

@Injectable({ providedIn: 'root' })
export class Register {
    constructor(
        private http: HttpClient,
        private accountService: AccountsDBService,
        private srpService: SrpService,
        private crypto: CryptoService
    ) {}

    save(account: any): Observable<any> {
        // Generate the new DB
        const newAccountsDB = this.accountService.init();
        const initVector = this.crypto.getRandomNumber(10);
        const salt = this.crypto.getRandomNumber(16);

        const accountCopy = Object.assign({}, account);
        const accountDBDTO = new AccountsDB();
        return Observable.fromPromise(this.srpService.generateVerifier(accountCopy.login, salt, accountCopy.password))
            .map(verifier => {
                accountCopy.password = null;
                accountCopy.verifier = verifier;
                accountCopy.salt = salt;
                return accountCopy;
            })
            .flatMap(accountOut => this.crypto.creatingKey('', account.password))
            .flatMap(derivedCryptoKey => this.crypto.cryptingDB(initVector, newAccountsDB, derivedCryptoKey))
            .flatMap((accountDB: ArrayBuffer) =>
                this.crypto.toBase64Promise(new Blob([new Uint8Array(accountDB)], { type: 'application/octet-stream' }))
            )
            .flatMap((accountDBbase64: string) => {
                accountDBDTO.database = accountDBbase64;
                accountDBDTO.databaseContentType = 'application/octet-stream';
                accountDBDTO.initializationVector = initVector;
                accountDBDTO.nbAccounts = 0;
                accountCopy.authenticationKey = newAccountsDB.authenticationKey;
                accountCopy.accountsDB = accountDBDTO;
                return this.crypto.generateHash(accountDBDTO.database);
            })
            .flatMap(sum => {
                accountDBDTO.sum = sum;
                return this.http.post('api/register', accountCopy, { observe: 'response' });
            });
    }
}

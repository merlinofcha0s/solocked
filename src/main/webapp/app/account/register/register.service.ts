import { CryptoService } from './../../shared/crypto/crypto.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AccountsService } from '../../shared/account/accounts.service';
// import { AES, enc, SHA3 } from 'crypto-js';
import { Accounts } from '../../shared/account/accounts.model';

@Injectable()
export class Register {

    constructor(private http: Http, private accountService: AccountsService
        , private crypto: CryptoService) { }

    save(account: any): Observable<any> {
        return Observable.fromPromise(this.crypto.creatingKey(account.password))
            .flatMap((hashBuffer) => {
                // account.passwordForAccountDB = hash;
                return Observable.fromPromise(this.crypto.cryptingDB(this.accountService.init(), hashBuffer));
            })
            .flatMap((accountDB) => {
                account.db = accountDB;
                return this.http.post('api/register', account)
            });
    }
}

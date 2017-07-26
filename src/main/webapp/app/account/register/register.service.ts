import { CryptoService } from './../../shared/crypto/crypto.service';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
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
            .flatMap((derivedCryptoKey) => {
                return Observable.fromPromise(this.crypto.cryptingDB(this.accountService.init(), derivedCryptoKey));
            })
            .flatMap((accountDB) => {
                account.initializationVector = this.crypto.decodeArrayToString(this.crypto.initializationVector);

                const formData = new FormData();
                const accountDBBlob = new Blob([accountDB], { type: 'application/octet-stream' });
                const accountDataBlob = new Blob([JSON.stringify(account)], { type: 'application/json' });

                formData.append('encryptedAccountDB', accountDBBlob, 'encryptedAccountDB');
                formData.append('account', accountDataBlob, 'account');

                return this.http.post('api/register', formData);
            });
    }
}

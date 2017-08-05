import { CryptoService } from './../../shared/crypto/crypto.service';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AccountsService } from '../../shared/account/accounts.service';
import { Accounts } from '../../shared/account/accounts.model';

@Injectable()
export class Register {

    constructor(private http: Http, private accountService: AccountsService
        , private crypto: CryptoService) { }

    save(account: any): Observable<any> {
        // Generate the new DB
        const newAccountsDB = this.accountService.init()

        return Observable.fromPromise(this.crypto.creatingKey(account.password))
            .flatMap((derivedCryptoKey) => Observable.fromPromise(this.crypto.cryptingDB(newAccountsDB, derivedCryptoKey)))
            .flatMap((accountDB) => {
                // Creation and decoding of the initialization vector
                account.initializationVector = this.crypto.decodeInitVector(this.crypto.initializationVector);
                // We store the authentication key in the password field for comparision during the login
                account.password = newAccountsDB.authenticationKey;

                const formData = new FormData();
                const accountDBBlob = new Blob([accountDB], { type: 'application/octet-stream' });
                const accountDataBlob = new Blob([JSON.stringify(account)], { type: 'application/json' });

                formData.append('encryptedAccountDB', accountDBBlob, 'encryptedAccountDB');
                formData.append('account', accountDataBlob, 'account');

                return this.http.post('api/register', formData);
            });
    }
}

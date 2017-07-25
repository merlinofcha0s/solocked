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
                const formData = new FormData();
                const content = '<a id="a"><b id="b">hey!</b></a>'; // le corps du nouveau fichier...
                const blob = new Blob([content], { type: 'text/xml' });
                // formData.append('encryptedAccountDB', new Blob([new Uint8Array(accountDB)], { type: 'octet/stream' }));
                formData.append('encryptedAccountDB', blob);
                formData.append('account', JSON.stringify(account));

                // account.encryptedAccountDB = new Uint8Array(accountDB);
                account.initializationVector = this.crypto.decodeArrayToString(this.crypto.initializationVector);
                const headersCustom = new Headers();
                headersCustom.append('Content-Type', 'multipart/form-data;application/octet-stream,application/json;text/xml')
                return this.http.post('api/register', formData, { headers: headersCustom });
            });
    }
}

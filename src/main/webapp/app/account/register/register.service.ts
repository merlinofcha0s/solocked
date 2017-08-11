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
        , private dataUtils: JhiDataUtils) { }

    save(account: any): Observable<any> {
        // Generate the new DB
        const newAccountsDB = this.accountService.init();
        const passwordStorage = account.password;

        return Observable.fromPromise(this.crypto.creatingKey(account.password))
            .flatMap((derivedCryptoKey) => Observable.fromPromise(this.crypto.cryptingDB(newAccountsDB, derivedCryptoKey)))
            .flatMap((accountDB: ArrayBuffer) => {
                return this.toBase64Promise(new Blob([new Uint8Array(accountDB)], { type: 'application/octet-stream' }));

                /* const byteArray = new Uint8Array(accountDB);
                 let stringArray = '';
                 for (let i = 0; i < byteArray.byteLength; i++) {
                     stringArray += byteArray[i] + ',';
                 }
 
                 console.log('out: ' + stringArray);*/

                // Creation and decoding of the initialization vector
                // account.initializationVector = '01111'; /* this.crypto.decodeInitVector(this.crypto.initializationVector); */
                // We store the authentication key in the password field for comparision during the login


                /* const formData = new FormData();
                 const accountDBBlob = new Blob([accountDB], { type: 'application/octet-stream' });
                 const accountDataBlob = new Blob([JSON.stringify(account)], { type: 'application/json' });
 
                 formData.append('encryptedAccountDB', accountDBBlob, 'encryptedAccountDB');
                 formData.append('account', accountDataBlob, 'account');*/

                // return this.http.post('api/register', account);
            }).flatMap((base64Data) => {
                const accountDBDTO = new AccountsDB();
                // const position = base64Data.indexOf(',') + 1;
                accountDBDTO.database = base64Data // .substring(position, base64Data.length);
                accountDBDTO.databaseContentType = 'application/octet-stream';
                accountDBDTO.initializationVector = '01111';
                account.password = newAccountsDB.authenticationKey;

                account.accountsDB = accountDBDTO;
                return this.http.post('api/register', account);
            });
    }

    toBase64Promise(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            this.dataUtils.toBase64(new File([blob], 'accountDB'), (base64Data) => {
                resolve(base64Data);
            });
        });
    }

    toBase64Blob(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(blob);
            reader.onloadend = () => {
                console.log('blob to base 64');
                resolve(reader.result);
            }
        });
    }
}

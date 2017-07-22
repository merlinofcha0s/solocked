import { CryptoService } from './../../shared/crypto/crypto.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { hashSync } from 'bcryptjs';
import { AccountsService } from '../../shared/account/accounts.service';
// import { AES, enc, SHA3 } from 'crypto-js';
import { Accounts } from '../../shared/account/accounts.model';

@Injectable()
export class Register {

    constructor(private http: Http, private accountService: AccountsService
        , private crypto: CryptoService) { }

    save(account: any): Observable<any> {
        return Observable.fromPromise(this.crypto.hashingWithIteration(account.password))
            .flatMap((hash) => {
                account.passwordForAccountDB = hash;
                return this.crypto.cryptingDB(this.accountService.init());
            })
            /*.flatMap((accountDB) => {
                account.db = accountDB;
                return this.http.post('api/register', account)
            })*/;
    }

    prepareAccountDB(account: any): any {

        /*account.password = '123456';
        console.log('Password after : ' + account.password);*/

        // Init accounts DB
        /*const accounts = this.accountService.init();
        accounts.accounts.forEach((acccount) => console.log(acccount.titre));
        console.log('Content of the db before encryption  : ' + accounts.accounts);
        const accountsJSON = JSON.stringify(accounts);
        const encryptedDB = AES.encrypt(accountsJSON, account.passwordForAccountDB);
        console.log('Encrypted data : ' + encryptedDB.toString());

        const bytes = AES.decrypt(encryptedDB.toString(), account.passwordForAccountDB);
        let decryptedData = new Accounts();
        decryptedData =  Object.assign(new Accounts(), JSON.parse(bytes.toString(enc.Utf8)));
        console.log('decrypted data :');
        decryptedData.accounts.forEach((acccount) => console.log(acccount.titre));*/

        // TODO : Crypting accountDB
        // TODO : testing to decrypt
        // TODO : Add to account bean
    }
}

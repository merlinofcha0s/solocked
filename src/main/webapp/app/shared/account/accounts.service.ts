import { SessionStorageService } from 'ng2-webstorage';
import { CryptoService } from '../crypto/crypto.service';
import { CryptoUtilsService } from '../crypto/crypto-utils.service';
import { Observable } from 'rxjs/Rx';
import { AccountsDB } from '../../entities/accounts-db/accounts-db.model';
import { AccountsDBService } from '../../entities/accounts-db/accounts-db.service';
import { Account } from './account.model';
import { Accounts } from './accounts.model';
import { Injectable } from '@angular/core';
import { AccountType } from './account-type.model';

@Injectable()
export class AccountsService {

    constructor(private accountsDBService: AccountsDBService,
        private cryptoUtilsService: CryptoUtilsService,
        private sessionStorage: SessionStorageService,
        private cryptoService: CryptoService) { }

    init(): Accounts {
        const accountsInitialized = new Accounts();
        accountsInitialized.authenticationKey = this.getRandomString(22);
        const sampleAccount = new Account('username', 'password', 'title', AccountType.Default);
        accountsInitialized.accounts.push(sampleAccount);

        return accountsInitialized;
    }

    getRandomString(length: number) {
        let text = ''
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return text;
    }

    saveNewAccount(account: Account) {
        this.accountsDBService.getDbUserConnected()
            .flatMap((accountDbDto: AccountsDB) => this.decryptWithKeyInStorage(accountDbDto))
            .subscribe((accounts: Accounts) => {
                accounts.authenticationKey = '';
                accounts.accounts.push(account);
                this.sessionStorage.store('accountsdb', accounts);
            });

        // TODO: Decrypt
        // TODO: Rajouter l'account
        // TODO : MAJ du localstorage
        // TODO : Rechiffrer
        // TODO : Renvoyer dans le WS 
    }

    decryptWithKeyInStorage(accountDbDto: AccountsDB): Observable<Accounts> {
        let accountDBArrayBufferOut = null;
        return Observable.of(this.cryptoUtilsService.b64toBlob(accountDbDto.database, 'application/octet-stream', 2048))
            .flatMap((accountDBBlob: Blob) => this.cryptoUtilsService.blobToArrayBuffer(accountDBBlob))
            .flatMap((accountDBArrayBuffer) => {
                accountDBArrayBufferOut = accountDBArrayBuffer;
                return this.cryptoService.getCryptoKeyInStorage()
            })
            .flatMap((cryptoKey: CryptoKey) => {
                return this.cryptoService.decrypt(accountDbDto.initializationVector, cryptoKey, accountDBArrayBufferOut)
            }).flatMap((decryptedDB: ArrayBuffer) => {
                return Observable.of(this.cryptoUtilsService.arrayBufferToAccounts(decryptedDB));
            });
    }

}

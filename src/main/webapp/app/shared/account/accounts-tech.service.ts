import { CryptoService } from './../crypto/crypto.service';
import { CryptoUtilsService } from './../crypto/crypto-utils.service';
import { AccountsDBService } from './../../entities/accounts-db/accounts-db.service';
import { AccountsDB } from './../../entities/accounts-db/accounts-db.model';
import { Accounts } from './accounts.model';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class AccountsTechService {

    constructor(private accountsDBService: AccountsDBService,
        private cryptoUtils: CryptoUtilsService,
        private crypto: CryptoService) {

    }

    synchroDB(): Observable<Accounts> {
        return this.accountsDBService.getDbUserConnected()
            .flatMap((accountDbDto: AccountsDB) => this.decryptWithKeyInStorage(accountDbDto))
            .flatMap((accounts: Accounts) => Observable.of(accounts));
    }

    saveEncryptedDB(accounts: Accounts, initVector: string): Observable<AccountsDB> {
        const accountDBDTO = new AccountsDB();
        return this.encryptWithKeyInStorage(accounts, initVector)
            .flatMap((accountDB: ArrayBuffer) => this.cryptoUtils.toBase64Promise(new Blob([new Uint8Array(accountDB)], { type: 'application/octet-stream' })))
            .flatMap((accountDBbase64: string) => {
                accountDBDTO.database = accountDBbase64;
                accountDBDTO.databaseContentType = 'application/octet-stream';
                accountDBDTO.initializationVector = initVector;
                accountDBDTO.operationAccountType = accounts.operationAccountType;
                return this.crypto.generateChecksum(accountDBDTO.database);
            }).flatMap((sum) => {
                accountDBDTO.sum = sum;
                return this.accountsDBService.updateDBUserConnected(accountDBDTO);
            });
    }

    decryptWithKeyInStorage(accountDbDto: AccountsDB): Observable<Accounts> {
        let accountDBArrayBufferOut = null;
        return Observable
            .of(this.cryptoUtils.b64toBlob(accountDbDto.database, 'application/octet-stream', 2048))
            .flatMap((accountDBBlob: Blob) => this.cryptoUtils.blobToArrayBuffer(accountDBBlob))
            .flatMap((accountDBArrayBuffer) => {
                accountDBArrayBufferOut = accountDBArrayBuffer;
                return this.crypto.getCryptoKeyInStorage()
            })
            .flatMap((cryptoKey: CryptoKey) => {
                return this.crypto.decrypt(accountDbDto.initializationVector, cryptoKey, accountDBArrayBufferOut)
            })
            .flatMap((decryptedDB: ArrayBuffer) => {
                return Observable.of(this.cryptoUtils.arrayBufferToAccounts(decryptedDB));
            });
    }

    encryptWithKeyInStorage(accounts: Accounts, initVector: string): Observable<ArrayBuffer> {
        return this.crypto.getCryptoKeyInStorage()
            .flatMap((cryptoKey: CryptoKey) => this.crypto.cryptingDB(initVector, accounts, cryptoKey));
    }

}

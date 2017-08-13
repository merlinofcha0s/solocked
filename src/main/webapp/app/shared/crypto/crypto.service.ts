import { CryptoUtilsService } from './crypto-utils.service';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { Observable } from 'rxjs/Rx';
import { Accounts } from './../account/accounts.model';
import { AccountsService } from './../account/accounts.service';
import { Injectable } from '@angular/core';
import { TextEncoder } from 'text-encoding';

@Injectable()
export class CryptoService {

    private cryptingAlgorithm = 'AES-GCM';

    constructor(private accountService: AccountsService
        , private dataUtils: JhiDataUtils
        , private sessionStorage: SessionStorageService
        , private cryptoUtils: CryptoUtilsService) { }

    /**
     * Create the key from the password
     * Secure the password by deriving it
     * @param input The raw password
     */
    async creatingKey(input: string): Promise<CryptoKey> {
        const passwordArrayBuffer = new TextEncoder('utf-8').encode(input);
        // Importing the raw input from the password field to a Cryptokey
        const passwordKey = await this.importKeyString(passwordArrayBuffer);
        // Key derivation from the password to a CryptoKey for securing the password
        const derivedKey = await this.deriveKeyFromPassword(passwordKey, this.cryptoUtils.hexToArrayBuffer('e85c53e7f119d41fd7895cdc9d7bb9dd'));
        return derivedKey;
    }

    async importKeyString(password: Uint8Array): Promise<CryptoKey> {
        try {
            return await crypto.subtle.importKey('raw', password, { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']);
        } catch (e) {
            console.log(e);
        }
    }

    async deriveKeyFromPassword(passwordKeyToDerived: CryptoKey, saltBuffer: ArrayBuffer): Promise<CryptoKey> {
        try {
            return await crypto.subtle.deriveKey({
                'name': 'PBKDF2',
                'salt': saltBuffer,
                'iterations': 500000,
                'hash': 'SHA-512'
            }, passwordKeyToDerived,
                { 'name': this.cryptingAlgorithm, 'length': 256 },
                // Whether or not the key is extractable (less secure) or not (more secure)
                // when false, the key can only be passed as a web crypto object, not inspected
                true,
                ['encrypt', 'decrypt']
            )
        } catch (e) {
            console.log(e);
        }
    }

    async cryptingDB(initializationVector: string, accounts: Accounts, key: CryptoKey): Promise<ArrayBuffer> {
        const initVectorArrayBuffer = new TextEncoder('UTF-8').encode(initializationVector);

        const accountsJSON = JSON.stringify(accounts);
        const accountsJSONArrayBuffer = new TextEncoder('UTF-8').encode(accountsJSON);

        const encryptedData = await this.encrypt(initVectorArrayBuffer, key, accountsJSONArrayBuffer.buffer);

        return encryptedData;
    }

    async encrypt(initializationVector: ArrayBufferView, key: CryptoKey, dataToEncrypt: ArrayBuffer): Promise<ArrayBuffer> {
        try {
            // const initVectorEncoded = new TextEncoder('UTF-8').encode(this.getInitVector());
            return await window.crypto.subtle.encrypt({
                name: this.cryptingAlgorithm,
                iv: initializationVector,
                tagLength: 128,
            }, key, dataToEncrypt);
        } catch (e) {
            console.log(e);
        }
    }

    async decrypt(initializationVector: string, key: CryptoKey, encryptedData: ArrayBuffer): Promise<ArrayBuffer> {
        const initVectorArrayBuffer = new TextEncoder('UTF-8').encode(initializationVector);
        try {
            return await crypto.subtle.decrypt({ name: this.cryptingAlgorithm, iv: initVectorArrayBuffer }, key, encryptedData);
        } catch (e) {
            console.log('error : ' + e);
        }
    }

    putCryptoKeyInLocalStorage(key: CryptoKey) {
        Observable
            .fromPromise(crypto.subtle.exportKey('raw', key))
            .flatMap((rawKey) => this.cryptoUtils.toBase64Promise(new Blob([new Uint8Array(rawKey)], { type: 'application/octet-stream' })))
            .subscribe((base64Key) => {
                this.sessionStorage.store('key', base64Key);
            });
    }
}

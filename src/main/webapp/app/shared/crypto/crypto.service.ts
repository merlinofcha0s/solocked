import {CryptoUtilsService} from './crypto-utils.service';
import {SessionStorageService} from 'ngx-webstorage';
import {JhiDataUtils} from 'ng-jhipster';
import {Observable} from 'rxjs/Rx';
import {Accounts} from './../account/accounts.model';
import {Injectable} from '@angular/core';
import {TextEncoder} from 'text-encoding';

@Injectable()
export class CryptoService {

    private cryptingAlgorithm = 'AES-GCM';

    constructor(private dataUtils: JhiDataUtils
        , private sessionStorage: SessionStorageService
        , private cryptoUtils: CryptoUtilsService) {
    }

    /**
     * Create the key from the password
     * Secure the password by deriving it
     * @param input The raw password
     */
    async creatingKey(input: string): Promise<CryptoKey> {
        const passwordArrayBuffer = new TextEncoder('utf-8').encode(input);
        // Importing the raw input from the password field to a Cryptokey
        const passwordKey = await this.importKey(passwordArrayBuffer, ['deriveBits', 'deriveKey'], false, 'PBKDF2');
        // Key derivation from the password to a CryptoKey for securing the password
        return await this.deriveKeyFromPassword(passwordKey, this.cryptoUtils.hexToArrayBuffer('12af0251ae3c818e446f503de25b6e2f'));
    }

    /**
     * Create the key with the raw password inside
     * @param password password or key
     * @param right what we can do with the key : ['deriveBits', 'deriveKey']
     * @param exportable extractable or not
     * @param cryptingAlgorithm PBKDF2 or AES-GCM in our case (see the crypto subtle docs for more details)
     */
    async importKey(password: Uint8Array, right: Array<string>, exportable: boolean, cryptingAlgorithm: string): Promise<CryptoKey> {
        try {
            return await crypto.subtle.importKey('raw', password, {name: cryptingAlgorithm}, exportable, right);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Derive the password to securing it and transform to a crypto key
     * Allow us to encrypt data : in our case the accont DB
     * @param passwordKeyToDerived The raw password key
     * @param saltBuffer The salt for the key
     */
    async deriveKeyFromPassword(passwordKeyToDerived: CryptoKey, saltBuffer: ArrayBuffer): Promise<CryptoKey> {
        try {
            return await crypto.subtle.deriveKey({
                    'name': 'PBKDF2',
                    'salt': saltBuffer,
                    'iterations': 500000,
                    'hash': 'SHA-512'
                }, passwordKeyToDerived,
                {'name': this.cryptingAlgorithm, 'length': 256},
                // Whether or not the key is extractable (less secure) or not (more secure)
                // when false, the key can only be passed as a web crypto object, not inspected
                true,
                ['encrypt', 'decrypt']
            );
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Crypting the DB
     * @param initializationVector IV for securing when exchanging the DB through internet
     * @param accounts the accountDB in clear text
     * @param key The key used for the encryption
     */
    async cryptingDB(initializationVector: string, accounts: Accounts, key: CryptoKey): Promise<ArrayBuffer> {
        // Encode the IV to arraybuffer
        const initVectorArrayBuffer = new TextEncoder('UTF-8').encode(initializationVector);

        const accountsJSON = JSON.stringify(accounts);
        // Encode the account JSON to array buffer
        const accountsJSONArrayBuffer = new TextEncoder('UTF-8').encode(accountsJSON);

        const encryptedData = await this.encrypt(initVectorArrayBuffer, key, accountsJSONArrayBuffer.buffer);

        return encryptedData;
    }

    async encrypt(initializationVector: ArrayBufferView, key: CryptoKey, dataToEncrypt: ArrayBuffer): Promise<ArrayBuffer> {
        try {
            return await window.crypto.subtle.encrypt({
                name: this.cryptingAlgorithm,
                iv: initializationVector,
                tagLength: 128
            }, key, dataToEncrypt);
        } catch (e) {
            console.log(e);
        }
    }

    async decrypt(initializationVector: string, key: CryptoKey, encryptedData: ArrayBuffer): Promise<ArrayBuffer> {
        const initVectorArrayBuffer = new TextEncoder('UTF-8').encode(initializationVector);
        try {
            return await crypto.subtle.decrypt({
                name: this.cryptingAlgorithm,
                iv: initVectorArrayBuffer
            }, key, encryptedData);
        } catch (e) {
            console.log('error : ' + e);
        }
    }

    putCryptoKeyInStorage(key: CryptoKey): Observable<Boolean> {
        return Observable
            .fromPromise(crypto.subtle.exportKey('raw', key))
            .flatMap((rawKey) => this.cryptoUtils.toBase64Promise(new Blob([new Uint8Array(rawKey)], {type: 'application/octet-stream'})))
            .flatMap((base64Key) => {
                this.sessionStorage.store('key', base64Key);
                return Observable.of(true);
            });
    }

    getCryptoKeyInStorage(): Observable<CryptoKey> {
        const keyB64 = this.sessionStorage.retrieve('key');
        const keyBlob = this.cryptoUtils.b64toBlob(keyB64, 'application/octet-stream', 2048);
        return this.cryptoUtils.blobToArrayBuffer(keyBlob)
            .flatMap((keyArrayBuffer) => this.importKey(new Uint8Array(keyArrayBuffer), ['encrypt', 'decrypt'], true, this.cryptingAlgorithm));
    }

    async generateChecksum(accountDBB64: string): Promise<string> {
        // encode as UTF-8
        const msgBuffer = new TextEncoder('utf-8').encode(accountDBB64);
        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // Join all the hex strings into one
        return hashArray.map((b) => ('00' + b.toString(16)).slice(-2)).join('');
    }
}

import { SessionStorageService } from 'ngx-webstorage';
import { JhiDataUtils } from 'ng-jhipster';
import { Injectable } from '@angular/core';
import { Accounts } from 'app/shared/account/accounts.model';
import { KEY } from 'app/shared/constants/session-storage.constants';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { flatMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CryptoService {
    private cryptingAlgorithm = 'AES-GCM';

    constructor(private dataUtils: JhiDataUtils, private sessionStorage: SessionStorageService) {}

    /**
     * Create the key from the password
     * Secure the password by deriving it
     * @param password The raw password
     * @param salt The salt
     */
    async creatingKey(salt: string, password: string): Promise<CryptoKey> {
        const passwordArrayBuffer = new TextEncoder().encode(salt + password);
        // Importing the raw input from the password field to a Cryptokey
        const passwordKey = await this.importKey(passwordArrayBuffer, ['deriveBits', 'deriveKey'], false, 'PBKDF2');
        // Key derivation from the password to a CryptoKey for securing the password
        return await this.deriveKeyFromPassword(passwordKey, this.hexToArrayBuffer('12af0251ae3c818e446f503de25b6e2f'));
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
            return await crypto.subtle.importKey('raw', password, cryptingAlgorithm, exportable, right);
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
            return await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: saltBuffer,
                    iterations: 500000,
                    hash: 'SHA-512'
                },
                passwordKeyToDerived,
                { name: this.cryptingAlgorithm, length: 256 },
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
        const initVectorArrayBuffer = new TextEncoder().encode(initializationVector);

        const accountsJSON = JSON.stringify(accounts);
        // Encode the account JSON to array buffer
        const accountsJSONArrayBuffer = new TextEncoder().encode(accountsJSON);

        const encryptedData = await this.encrypt(initVectorArrayBuffer, key, accountsJSONArrayBuffer.buffer);

        return encryptedData;
    }

    async encrypt(initializationVector: ArrayBufferView, key: CryptoKey, dataToEncrypt: ArrayBuffer): Promise<ArrayBuffer> {
        try {
            return await window.crypto.subtle.encrypt(
                {
                    name: this.cryptingAlgorithm,
                    iv: initializationVector,
                    tagLength: 128
                },
                key,
                dataToEncrypt
            );
        } catch (e) {
            console.log(e);
        }
    }

    async decrypt(initializationVector: string, key: CryptoKey, encryptedData: ArrayBuffer): Promise<ArrayBuffer> {
        const initVectorArrayBuffer = new TextEncoder().encode(initializationVector);
        try {
            return await crypto.subtle.decrypt(
                {
                    name: this.cryptingAlgorithm,
                    iv: initVectorArrayBuffer
                },
                key,
                encryptedData
            );
        } catch (e) {
            console.log('error : ' + e);
        }
    }

    putCryptoKeyInStorage(key: CryptoKey): Observable<Boolean> {
        return fromPromise(crypto.subtle.exportKey('raw', key)).pipe(
            flatMap(rawKey => this.toBase64Promise(new Blob([new Uint8Array(rawKey)], { type: 'application/octet-stream' }))),
            flatMap(base64Key => {
                this.sessionStorage.store(KEY, base64Key);
                return of(true);
            })
        );
    }

    getCryptoKeyInStorage(): Observable<CryptoKey> {
        const keyB64 = this.sessionStorage.retrieve(KEY);
        const keyBlob = this.b64toBlob(keyB64, 'application/octet-stream', 2048);
        return this.blobToArrayBuffer(keyBlob).pipe(
            flatMap(keyArrayBuffer => this.importKey(new Uint8Array(keyArrayBuffer), ['encrypt', 'decrypt'], true, this.cryptingAlgorithm))
        );
    }

    async generateHash(input: string): Promise<string> {
        // encode as UTF-8
        const msgBuffer = new TextEncoder().encode(input);
        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // Join all the hex strings into one
        return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    }

    /**
     * Can be use to translate a hash(always in hex) in a buffer
     */
    hexToArrayBuffer(hex): ArrayBuffer {
        if (typeof hex !== 'string') {
            throw new TypeError('Expected input to be a string');
        }

        if (hex.length % 2 !== 0) {
            throw new RangeError('Expected string to be an even number of characters');
        }

        const view = new Uint8Array(hex.length / 2);

        for (let i = 0; i < hex.length; i += 2) {
            view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }

        return view.buffer;
    }

    getRandomNumber(length: number): string {
        const array = new Uint16Array(length);
        window.crypto.getRandomValues(array);

        let randomNumber = '';
        for (let i = 0; i < array.length; i++) {
            randomNumber += array[i] + '';
        }
        return randomNumber;
    }

    b64toBlob(b64Data, contentType, sliceSize): Blob {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    blobToArrayBuffer(blob: Blob): Observable<ArrayBuffer> {
        return Observable.create(observer => {
            const reader = new FileReader();
            reader.onloadend = e => {
                observer.next(reader.result);
            };
            reader.readAsArrayBuffer(blob);
        });
    }

    toBase64Promise(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            this.dataUtils.toBase64(new File([blob], 'accountDB'), base64Data => {
                resolve(base64Data);
            });
        });
    }

    arrayBufferToAccounts(decryptedDB: ArrayBuffer): Accounts {
        let dbDecrypted: Accounts = null;
        const decoder = new TextDecoder();
        const db = decoder.decode(decryptedDB);
        if (decryptedDB !== undefined) {
            dbDecrypted = JSON.parse(db);
        }
        return dbDecrypted;
    }
}

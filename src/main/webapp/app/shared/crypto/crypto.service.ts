import { JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs/Rx';
import { Accounts } from './../account/accounts.model';
import { AccountsService } from './../account/accounts.service';
import { Injectable } from '@angular/core';
import { TextEncoder } from 'text-encoding';

@Injectable()
export class CryptoService {

    // Number of iterations
    private cryptingAlgorithm = 'AES-GCM';
    initializationVector: ArrayBufferView;

    constructor(private accountService: AccountsService, private alertService: JhiAlertService) { }

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
        const derivedKey = await this.deriveKeyFromPassword(passwordKey, this.hexToArrayBuffer('e85c53e7f119d41fd7895cdc9d7bb9dd'));
        return derivedKey;
    }

    /* async importKeyBufferinput(hashBuffer: ArrayBuffer): Promise<CryptoKey> {
         try {
             return await crypto.subtle.importKey('raw', hashBuffer, this.cryptingAlgorithm, true, ['encrypt', 'decrypt']);
         } catch (e) {
             console.log(e);
         }
     }*/

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
                false,
                ['encrypt', 'decrypt']
            )
        } catch (e) {
            console.log(e);
        }
    }

    async cryptingDB(accounts: Accounts, key: CryptoKey): Promise<ArrayBuffer> {
        this.initializationVector = this.getInitializationVector();

        const accountsJSON = JSON.stringify(accounts);
        const accountsJSONArrayBuffer = new TextEncoder('UTF-8').encode(accountsJSON);

        const encryptedData = await this.encrypt(this.initializationVector, key, accountsJSONArrayBuffer);

        return encryptedData;
    }

    getInitializationVector(): ArrayBufferView {
        return window.crypto.getRandomValues(new Uint8Array(12));
    }

    async encrypt(initializationVector: ArrayBufferView, key: CryptoKey, dataToEncrypt: Uint8Array): Promise<ArrayBuffer> {
        try {
            return await window.crypto.subtle.encrypt({
                name: this.cryptingAlgorithm,
                iv: this.initializationVector,
                tagLength: 128,
            }, key, dataToEncrypt);
        } catch (e) {
            console.log(e);
        }
    }

    async decrypt(initializationVector: ArrayBufferView, key: CryptoKey, encryptedData: ArrayBuffer): Promise<ArrayBuffer> {
        try {
            return await crypto.subtle.decrypt({ name: this.cryptingAlgorithm, iv: this.initializationVector }, key, encryptedData);
        } catch (e) {
            console.log('error : ' + e);
        }
    }

    /* async testDecrypt() {
         try {
             const key = await this.creatingKey(this.input);
             const dataBuffer = await this.decrypt(null, key, this.encryptedData);
             const plaintext = this.decodeArrayToString(dataBuffer);
             console.log('Plain text : ' + plaintext);
         } catch (e) {
             console.log(e);
         }
     }*/

    /**
     * Use here for get the account db in JS bean
     * @param buffer The buffer to transform in string
     */
    decodeArrayToString(buffer): string {
        // Careful : Don't work on hex like hash
        return new TextDecoder().decode(buffer);
    }

    /**
     * Can be use to translate a hash(always in hex) in a buffer
     */
    hexToArrayBuffer(hex): ArrayBuffer {
        if (typeof hex !== 'string') {
            throw new TypeError('Expected input to be a string')
        }

        if ((hex.length % 2) !== 0) {
            throw new RangeError('Expected string to be an even number of characters')
        }

        const view = new Uint8Array(hex.length / 2)

        for (let i = 0; i < hex.length; i += 2) {
            view[i / 2] = parseInt(hex.substring(i, i + 2), 16)
        }

        return view.buffer
    }

}

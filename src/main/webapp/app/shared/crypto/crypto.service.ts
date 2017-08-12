import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { Observable } from 'rxjs/Rx';
import { Accounts } from './../account/accounts.model';
import { AccountsService } from './../account/accounts.service';
import { Injectable } from '@angular/core';
import { TextEncoder } from 'text-encoding';

@Injectable()
export class CryptoService {

    private cryptingAlgorithm = 'AES-GCM';

    constructor(private accountService: AccountsService, private dataUtils: JhiDataUtils) { }

    /**
     * Create the key from the password
     * Secure the password by deriving it
     * @param input The raw password
     */
    async creatingKey(input: string): Promise<CryptoKey> {
        console.log('Creating the key');
        const passwordArrayBuffer = new TextEncoder('utf-8').encode(input);
        // Importing the raw input from the password field to a Cryptokey
        const passwordKey = await this.importKeyString(passwordArrayBuffer);
        // Key derivation from the password to a CryptoKey for securing the password
        const derivedKey = await this.deriveKeyFromPassword(passwordKey, this.hexToArrayBuffer('e85c53e7f119d41fd7895cdc9d7bb9dd'));
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
                false,
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
            // const initVectorEncoded = new TextEncoder('UTF-8').encode(this.getInitVector());
            console.log('Decrypting.....');
            return await crypto.subtle.decrypt({ name: this.cryptingAlgorithm, iv: initVectorArrayBuffer }, key, encryptedData);
        } catch (e) {
            console.log('error : ' + e);
        }
    }

    /*async testDecrypt(encryptedData: ArrayBuffer, password: string) {
        try {
            const key = await this.creatingKey(password);
            const dataBuffer = await this.decrypt(null, key, encryptedData);
            const plaintext = this.decodeArrayToString(dataBuffer);
            console.log('Plain text : ' + plaintext);
        } catch (e) {
            console.log(e);
        }
    }*/

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

    getRandomNumber(): string {
        return Math.floor((Math.random() * 10000000000000000000000) + 1).toString();
    }

    b64toBlob(b64Data, contentType, sliceSize) {
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

    blobToArrayBuffer(blob: Blob): Promise<string> {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.addEventListener('loadend', (e) => {
                resolve(reader.result);
            });

            // Start reading the blob as text.
            reader.readAsArrayBuffer(blob);
        });
    }

    toBase64Promise(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            this.dataUtils.toBase64(new File([blob], 'accountDB'), (base64Data) => {
                resolve(base64Data);
            });
        });
    }

}

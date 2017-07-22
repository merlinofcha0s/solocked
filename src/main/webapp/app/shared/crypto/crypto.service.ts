import { Observable } from 'rxjs/Rx';
import { Accounts } from './../account/accounts.model';
import { AccountsService } from './../account/accounts.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CryptoService {

    // Number of iterations
    private salt = 2500;
    private cryptingAlgorithm = 'AES-GCM';
    private hashingAlgorithm = 'SHA-256';

    constructor(private accountService: AccountsService) { }

    async hashingWithIteration(input: string): Promise<string> {
        let hashedInput = '';
        let firstPass = true;
        const passwordArrayBuffer = new TextEncoder('utf-8').encode(input);
        let hashBuffer;
        for (let _i = 0; _i < this.salt; _i++) {
            if (firstPass) {
                hashBuffer = await window.crypto.subtle.digest(this.hashingAlgorithm, passwordArrayBuffer);
                firstPass = false;
            } else {
                const hashedInputBuffer = new TextEncoder().encode(hashedInput);
                hashBuffer = await window.crypto.subtle.digest(this.hashingAlgorithm, hashBuffer);
            }
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            hashedInput = hashArray.map((b) => ('00' + b.toString(16)).slice(-2)).join('');
        }

        return hashedInput;
    }

    async importKeyBufferinput(hashBuffer: ArrayBuffer): Promise<CryptoKey> {
        try {
            return await crypto.subtle.importKey('raw', hashBuffer, this.cryptingAlgorithm, true, ['encrypt', 'decrypt']);
        } catch (e) {
            console.log(e);
        }
    }

    async importKeyString(hashString: string) {
        return await crypto.subtle.importKey('raw', this.hexToArrayBuffer(hashString), this.cryptingAlgorithm, true, ['encrypt', 'decrypt']);
    }

    async cryptingDB(accounts: Accounts, hashBuffer: string): Promise<ArrayBuffer> {
        const initializationVector = window.crypto.getRandomValues(new Uint8Array(12));
        let key;
        try {
            key = await this.importKeyString(hashBuffer);
        } catch (e) {
            console.log(e);
        }

        const accountsJSON = JSON.stringify(accounts);
        const accountsJSONArrayBuffer = new TextEncoder('UTF-8').encode(accountsJSON);

        const encryptedData = await this.encrypt(initializationVector, key, accountsJSONArrayBuffer);

        return encryptedData;
    }

    async encrypt(initializationVector: ArrayBufferView, key: CryptoKey, dataToEncrypt: Uint8Array): Promise<ArrayBuffer> {
        try {
            return await window.crypto.subtle.encrypt({
                name: 'AES-GCM',
                iv: initializationVector,
                tagLength: 128,
            }, key, dataToEncrypt);
        } catch (e) {
            console.log(e);
        }
    }

    async decrypt(initializationVector: ArrayBufferView, key: CryptoKey, encryptedData: ArrayBuffer) {
        try {
            return await crypto.subtle.decrypt({ name: 'AES-GCM', iv: initializationVector }, key, encryptedData);
        } catch (e) {
            console.log('error : ' + e);
        }
    }

    decodeArrayToString(buffer) {
        // Careful : Don't work on hex like hash
        const plaintext = new TextDecoder().decode(buffer);
    }

    hexToArrayBuffer(hex) {
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

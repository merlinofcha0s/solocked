import { JhiDataUtils } from 'ng-jhipster';
import { Accounts } from './../account/accounts.model';
import { Injectable } from '@angular/core';

@Injectable()
export class CryptoUtilsService {

    constructor(private dataUtils: JhiDataUtils) { }

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

    blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
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

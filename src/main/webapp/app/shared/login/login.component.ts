import { AccountsDB } from './../../entities/accounts-db/accounts-db.model';
import { TextEncoder } from 'text-encoding';
import { Observable } from 'rxjs/Rx';
import { CryptoService } from './../crypto/crypto.service';
import { Component, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { JhiEventManager } from 'ng-jhipster';

import { LoginService } from './login.service';
import { StateStorageService } from '../auth/state-storage.service';
import { SocialService } from '../social/social.service';

@Component({
    selector: 'jhi-login-modal',
    templateUrl: './login.component.html'
})
export class JhiLoginModalComponent implements AfterViewInit {
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;

    constructor(
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private stateStorageService: StateStorageService,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private socialService: SocialService,
        private router: Router,
        public activeModal: NgbActiveModal,
        public cryptoService: CryptoService
    ) {
        this.credentials = {};
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []);
    }

    cancel() {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        this.authenticationError = false;
        this.activeModal.dismiss('cancel');
    }

    login() {
        // let initVector = null;
        this.loginService.prelogin(this.username)
            .map((res: Response) => res.json())
            .subscribe((accountDB: AccountsDB) => {
                console.log('account : ' + accountDB.database);
                const accountDBBlob = this.b64toBlob(accountDB.database, 'application/octet-stream', 512);

                console.log(accountDBBlob);
                /*const account2 = new Blob([accountDBBlob], { type: accountDB.databaseContentType });
                console.log('account: ' + account2);*/

                const reader = new FileReader();

                // This fires after the blob has been read/loaded.
                reader.addEventListener('loadend', (e) => {
                    const text = reader.result;
                    console.log(text);
                    Observable.fromPromise(this.cryptoService.creatingKey(this.password))
                        .subscribe((derivedCryptoKey) => {
                            Observable.fromPromise(this.cryptoService.decrypt(null, derivedCryptoKey, text))
                                .subscribe((decryptedDB) => {
                                    console.log('Decrypting');
                                    console.log('Decrypted :' + decryptedDB);
                                    const decoder = new TextDecoder();
                                    const db = decoder.decode(decryptedDB);
                                    console.log('db : ' + db);
                                });
                        });
                });

                // Start reading the blob as text.
                reader.readAsArrayBuffer(accountDBBlob);

                /* Observable.fromPromise(this.cryptoService.creatingKey(this.password))
                     .subscribe((derivedCryptoKey) => {
                         Observable.fromPromise(this.blobToArrayBuffer(account2))
                             .flatMap((arrayBuffer) => {
                                 return this.cryptoService.decrypt(null, derivedCryptoKey, arrayBuffer);
                             }).subscribe((decryptedDB) => {
                                 console.log('Decrypting');
                                 console.log('Decrypted :' + decryptedDB);
                             });
                     });*/
            });

        /*this.loginService.login({
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        }).then(() => {
            this.authenticationError = false;
            this.activeModal.dismiss('login success');
            if (this.router.url === '/register' || (/activate/.test(this.router.url)) ||
                this.router.url === '/finishReset' || this.router.url === '/requestReset') {
                this.router.navigate(['']);
            }

            this.eventManager.broadcast({
                name: 'authenticationSuccess',
                content: 'Sending Authentication Success'
            });

            // // previousState was set in the authExpiredInterceptor before being redirected to login modal.
            // // since login is succesful, go to stored previousState and clear previousState
            const redirect = this.stateStorageService.getUrl();
            if (redirect) {
                this.router.navigate([redirect]);
            }
        }).catch(() => {
            this.authenticationError = true;
        });*/
    }

    register() {
        this.activeModal.dismiss('to state register');
        this.router.navigate(['/register']);
    }

    requestResetPassword() {
        this.activeModal.dismiss('to state requestReset');
        this.router.navigate(['/reset', 'request']);
    }

    blobToArrayBuffer(blobToConvert: Blob): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = function () {
                resolve(this.result);
            };
            fileReader.readAsArrayBuffer(blobToConvert);
        });
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

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
}

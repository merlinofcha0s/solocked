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
        let accountDBJSONOut = null;
        let accountDBArrayBufferOut = null;
        this.loginService.prelogin(this.username)
            .map((res: Response) => res.json())
            .flatMap((accountDBJSON: AccountsDB) => {
                accountDBJSONOut = accountDBJSON;
                return Observable.of(this.cryptoService.b64toBlob(accountDBJSONOut.database, 'application/octet-stream', 2048));
            })
            .flatMap((accountDBBlob: Blob) => this.cryptoService.blobToArrayBuffer(accountDBBlob))
            .flatMap((accountDBArrayBuffer) => {
                accountDBArrayBufferOut = accountDBArrayBuffer;
                return this.cryptoService.creatingKey(this.password)
            })
            .flatMap((derivedCryptoKey: CryptoKey) => this.cryptoService.decrypt(accountDBJSONOut.initializationVector, derivedCryptoKey, accountDBArrayBufferOut))
            .subscribe((decryptedDB: ArrayBuffer) => {
                const decoder = new TextDecoder();
                const db = decoder.decode(decryptedDB);
                console.log('decryted OK : ' + db);
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
}

import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { Accounts } from './../account/accounts.model';
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
import { CryptoUtilsService } from '../crypto/crypto-utils.service';

@Component({
    selector: 'jhi-login-modal',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class JhiLoginModalComponent implements AfterViewInit {
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;
    loading: boolean;

    constructor(
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private stateStorageService: StateStorageService,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private socialService: SocialService,
        private router: Router,
        public activeModal: NgbActiveModal,
        private cryptoService: CryptoService,
        private cryptoUtils: CryptoUtilsService,
        private sessionStorageService: SessionStorageService
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
        this.loading = true;
        if (this.username === 'admin') {
            this.loginJHI();
        } else {
            this.loginService.prelogin(this.username, this.password)
                .subscribe((decryptedDB: ArrayBuffer) => {
                    const accounts = this.cryptoUtils.arrayBufferToAccounts(decryptedDB);
                    if (accounts === null) {
                        this.loading = false;
                        this.authenticationError = true;
                    } else {
                        this.password = accounts.authenticationKey;
                        this.authenticationError = false;
                        this.sessionStorageService.store('accountsdb', JSON.stringify(accounts.accounts));
                        this.loginJHI();
                    }
                }, (error) => {
                    this.authenticationError = true;
                    this.loading = false;
                });
        }
    }

    loginJHI() {
        this.loginService.login({
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        }).then(() => {
            this.loading = false;
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
            this.loading = false;
        });
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

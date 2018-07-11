import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { AccountsService } from '../account/accounts.service';
import { isUndefined } from 'util';
import { LoginService, Principal } from 'app/core';
import { CryptoService } from 'app/shared/crypto/crypto.service';
import { Accounts } from 'app/shared/account/accounts.model';

@Component({
    selector: 'jhi-login-modal',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class JhiLoginModalComponent {
    authenticationError: boolean;
    password: string;
    authenticationKey: string;
    rememberMe: boolean;
    username: string;
    credentials: any;
    loading: boolean;

    constructor(
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private router: Router,
        private accountService: AccountsService,
        private principal: Principal
    ) {
        this.credentials = {};
    }

    cancel() {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        this.authenticationError = false;
        // this.activeModal.dismiss('cancel');
    }

    login() {
        this.loading = true;
        if (this.username === 'admin') {
            this.loginJHI();
        } else {
            this.loginService.prelogin(this.username, this.password).subscribe(
                (accounts: Accounts) => {
                    if (accounts === null) {
                        this.loading = false;
                        this.authenticationError = true;
                    } else {
                        this.authenticationKey = accounts.authenticationKey;
                        this.authenticationError = false;
                        accounts.authenticationKey = '';
                        this.accountService.saveOnBrowser(accounts);
                        this.loginJHI();
                    }
                },
                error => {
                    this.authenticationError = true;
                    this.loading = false;
                }
            );
        }
    }

    loginJHI() {
        this.loginService
            .login({
                username: this.username,
                // Difference between regular user and admin users
                password: !isUndefined(this.authenticationKey) ? this.authenticationKey : this.password,
                rememberMe: this.rememberMe
            })
            .then(() => {
                this.loading = false;
                this.authenticationError = false;
                // this.activeModal.dismiss('login success');
                if (
                    this.router.url === '/register' ||
                    /activate/.test(this.router.url) ||
                    this.router.url === '/finishReset' ||
                    this.router.url === '/requestReset'
                ) {
                    if (this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
                        this.router.navigate(['/user-management']);
                    } else {
                        this.router.navigate(['/accounts']);
                    }
                }

                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Authentication Success'
                });

                if (this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
                    this.router.navigate(['/user-management']);
                } else {
                    this.router.navigate(['/accounts']);
                }
                // // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // // since login is succesful, go to stored previousState and clear previousState
                /*const redirect = this.stateStorageService.getUrl();
            if (redirect) {
                this.router.navigate([redirect]);
            }*/
            })
            .catch(() => {
                this.authenticationError = true;
                this.loading = false;
            });
    }

    register() {
        // this.activeModal.dismiss('to state register');
        this.router.navigate(['/register']);
    }

    requestResetPassword() {
        // this.activeModal.dismiss('to state requestReset');
        this.router.navigate(['/reset', 'request']);
    }
}

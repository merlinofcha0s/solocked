import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { LoginService } from 'app/core/login/login.service';
import { SrpService } from 'app/entities/srp';
import { VERSION } from 'app/app.constants';
import { AccountService } from 'app/core';

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
    version: string;

    constructor(
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private router: Router,
        private srpService: SrpService,
        private accountService: AccountService
    ) {
        this.credentials = {};
        this.version = VERSION ? 'v' + VERSION : '';
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
        this.loginService.prelogin(this.username, this.password).subscribe(
            (step2Result: any) => {
                if (step2Result === null) {
                    this.loading = false;
                    this.authenticationError = true;
                } else {
                    this.loginJHI(step2Result.a, step2Result.M1, step2Result.salt);
                }
            },
            error => {
                this.authenticationError = true;
                this.loading = false;

                if (error.status === 417) {
                    this.loading = true;
                    this.authenticationError = false;
                    this.srpService.migrationToSRP(this.username, this.password).subscribe(() => {
                        this.login();
                    });
                }
            }
        );
    }

    loginJHI(a: string, m1: string, salt10: string) {
        this.loginService
            .login({
                username: this.username,
                password: a + ':' + m1,
                rememberMe: this.rememberMe,
                salt: salt10,
                passwordForDecrypt: this.password
            })
            .then(() => {
                this.loading = false;
                this.authenticationError = false;

                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Authentication Success'
                });

                if (this.accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
                    this.router.navigate(['admin/user-management']);
                } else {
                    this.router.navigate(['/accounts']);
                }
                // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // since login is successful, go to stored previousState and clear previousState
                // const redirect = this.stateStorageService.getUrl();
                // if (redirect) {
                //     this.stateStorageService.storeUrl(null);
                //     this.router.navigate([redirect]);
                // }
            })
            .catch(() => {
                this.authenticationError = true;
                this.loading = false;
            });
    }

    requestResetPassword() {
        // this.activeModal.dismiss('to state requestReset');
        this.router.navigate(['/reset', 'request']);
    }

    register() {
        this.router.navigate(['/register']);
    }
}

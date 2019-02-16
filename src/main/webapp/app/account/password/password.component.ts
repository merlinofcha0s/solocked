import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../core/login/login.service';
import { Router } from '@angular/router';
import { PasswordService } from 'app/account';
import { AccountService } from 'app/core';

@Component({
    selector: 'jhi-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
    doNotMatch: string;
    error: string;
    success: string;
    account: any;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    loading: boolean;

    maxPassword = 50;

    constructor(
        private passwordService: PasswordService,
        private loginService: LoginService,
        private router: Router,
        private accountService: AccountService
    ) {
        this.loading = false;
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.account = account;
        });
    }

    changePassword() {
        if (this.newPassword !== this.confirmPassword) {
            this.error = null;
            this.success = null;
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.loading = true;
            this.passwordService.save(this.newPassword).subscribe(
                () => {
                    this.error = null;
                    this.success = 'OK';
                    this.loading = false;
                    this.loginService.logout();
                    this.router.navigate(['']);
                },
                () => {
                    this.success = null;
                    this.error = 'ERROR';
                }
            );
        }
    }
}

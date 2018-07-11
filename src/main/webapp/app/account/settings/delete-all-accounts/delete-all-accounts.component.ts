import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { isUndefined } from 'util';
import { Principal, UserService } from 'app/core';
import { LoginService } from 'app/core';
import { Router } from '@angular/router';
import { SnackComponent } from 'app/shared/snack/snack.component';

@Component({
    selector: 'jhi-delete-all-accounts',
    templateUrl: './delete-all-accounts.component.html',
    styleUrls: ['./delete-all-accounts.component.scss']
})
export class DeleteAllAccountsComponent implements OnInit, OnDestroy {
    private config: MatSnackBarConfig;
    private deleteAccountSubscription: Subscription;

    username: string;
    maxUsername = 50;

    constructor(
        private userService: UserService,
        private loginService: LoginService,
        private dialogRef: MatDialogRef<DeleteAllAccountsComponent>,
        private router: Router,
        private snackBar: MatSnackBar,
        private principal: Principal
    ) {}

    ngOnInit() {
        this.config = new MatSnackBarConfig();
        this.config.verticalPosition = 'top';
        this.config.duration = 5000;
    }

    ngOnDestroy(): void {
        if (!isUndefined(this.deleteAccountSubscription)) {
            this.deleteAccountSubscription.unsubscribe();
        }
    }

    onDeleteAll() {
        this.principal.identity().then(account => {
            if (account.login === this.username) {
                this.deleteAccountSubscription = this.userService.destroyEntireUser().subscribe(success => {
                    if (success) {
                        this.dialogRef.close();
                        this.loginService.logout();
                        this.router.navigate(['/']);
                    } else {
                        const message = 'An error occured when deleting your account, please retry !!';
                        this.config.data = { icon: 'fa-exclamation-circle', text: message };
                        this.snackBar.openFromComponent(SnackComponent, this.config);
                    }
                });
            } else {
                const message = 'Not the right username';
                this.config.data = { icon: 'fa-exclamation-circle', text: message };
                this.snackBar.openFromComponent(SnackComponent, this.config);
            }
        });
    }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountsService} from '../../../shared/account/accounts.service';
import {Account} from '../../../shared/account/account.model';
import {MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {isUndefined} from 'util';
import {saveAs as importedSaveAs} from 'file-saver';
import {UserService, LoginService} from '../../../shared/index';
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import {SnackComponent} from "../../../shared/snack/snack.component";

@Component({
    selector: 'jhi-delete-all-accounts',
    templateUrl: './delete-all-accounts.component.html',
    styleUrls: ['./delete-all-accounts.component.scss']
})
export class DeleteAllAccountsComponent implements OnInit, OnDestroy {


    constructor(private userService: UserService
        , private loginService: LoginService
        , private dialogRef: MatDialogRef<DeleteAllAccountsComponent>
        , private router: Router
        , private snackBar: MatSnackBar
        ,private translateService: TranslateService,) {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    onDeleteAll() {
        this.userService.destroyEntireUser().subscribe((success) => {
            if (success) {
                this.dialogRef.close();
                this.loginService.logout();
                this.router.navigate(['/']);
            } else {
                const config = new MatSnackBarConfig();
                config.verticalPosition = 'top';
                config.duration = 20000;

                const message = 'An error occured when deleting your account, please retry !!';
                config.data = {icon: 'fa-check-circle-o', text: message}
                this.snackBar.openFromComponent(SnackComponent, config);
            }
        });
    }

}

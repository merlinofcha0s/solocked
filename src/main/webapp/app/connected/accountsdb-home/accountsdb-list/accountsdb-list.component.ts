import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Account} from '../../../shared/account/account.model';
import {AccountsService} from '../../../shared/account/accounts.service';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SnackComponent} from '../../../shared/snack/snack.component';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {Router} from '@angular/router';
import {SessionStorageService} from 'ngx-webstorage';
import {LAST_SEARCH} from '../../../shared';
import {AccountsdbDeleteComponent} from '../../accountsdb-delete/accountsdb-delete.component';

@Component({
    selector: 'jhi-accountsdb-list',
    templateUrl: './accountsdb-list.component.html',
    styleUrls: ['./accountsdb-list.component.scss'],
    animations: [
        trigger('appear', [
            state('void', style({opacity: 0.0, transform: 'translateY(100%)'})),
            state('*', style({opacity: 1, transform: 'translateY(0)'})),
            transition('void => *, * => void', animate('200ms  ease-in-out'))
        ])
    ]
})
export class AccountsdbListComponent implements OnInit, OnDestroy {

    @Input() accounts: Array<Account>;
    @Input() terms: string;

    constructor(private accountService: AccountsService,
                private snackBar: MatSnackBar,
                private translateService: TranslateService,
                private router: Router,
                private sessionStorage: SessionStorageService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.sessionStorage.store(LAST_SEARCH, this.terms);
    }

    makeFeatured(account: Account) {
        // Config and show toast message
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.duration = 3000;

        if (account.featured) {
            const message = this.translateService.instant('ninjaccountApp.accountsDB.home.online.toast.notPinned');
            this.accountService.addOrRemoveFeatured(account, false);
            config.data = {icon: 'fa-ban', text: message};
            this.snackBar.openFromComponent(SnackComponent, config);
        } else {
            const message = this.translateService.instant('ninjaccountApp.accountsDB.home.online.toast.pinned');
            this.accountService.addOrRemoveFeatured(account, true);
            config.data = {icon: 'fa-check-circle', text: message};
            this.snackBar.openFromComponent(SnackComponent, config);
        }
    }

    openConfirmationDeleteDialog(idToDelete: number) {
        this.dialog.open(AccountsdbDeleteComponent, {
            data: {
                id: idToDelete
            }
        });
    }
}

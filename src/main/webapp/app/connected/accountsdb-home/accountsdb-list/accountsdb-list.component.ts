import {Component, Input, OnInit} from '@angular/core';
import {Account} from '../../../shared/account/account.model';
import {AccountsService} from '../../../shared/account/accounts.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SnackComponent} from '../../../shared/snack/snack.component';

@Component({
    selector: 'jhi-accountsdb-list',
    templateUrl: './accountsdb-list.component.html',
    styleUrls: ['./accountsdb-list.component.scss']
})
export class AccountsdbListComponent implements OnInit {

    @Input() account: Account;

    constructor(private accountService: AccountsService,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {
    }

    ngOnInit() {
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
}

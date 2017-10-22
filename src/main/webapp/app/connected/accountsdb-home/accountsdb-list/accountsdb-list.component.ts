import {Component, Input, OnInit, Output} from '@angular/core';
import {Account} from '../../../shared/account/account.model';
import {AccountsService} from '../../../shared/account/accounts.service';
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'jhi-accountsdb-list',
    templateUrl: './accountsdb-list.component.html',
    styleUrls: ['./accountsdb-list.component.scss']
})
export class AccountsdbListComponent implements OnInit {

    @Input() account: Account;

    constructor(private accountService: AccountsService,
                private snackBar: MdSnackBar,
                private translateService: TranslateService) {
    }

    ngOnInit() {
    }

    makeFeatured(account: Account) {
        // Config and show toast message
        const config = new MdSnackBarConfig();
        config.verticalPosition = 'top';
        config.duration = 3000;

        if (account.featured) {
            const message = this.translateService.instant('ninjaccountApp.accountsDB.home.online.toast.notPinned');
            this.accountService.addOrRemoveFeatured(account, false);
            this.snackBar.open(message, '', config);
        } else {
            const message = this.translateService.instant('ninjaccountApp.accountsDB.home.online.toast.pinned');
            this.accountService.addOrRemoveFeatured(account, true);
            this.snackBar.open(message, '', config);
        }
    }
}

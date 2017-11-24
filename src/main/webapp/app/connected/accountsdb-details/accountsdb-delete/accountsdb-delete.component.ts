import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {AccountsService} from '../../../shared/account/accounts.service';
import {Router} from '@angular/router';
import {SnackComponent} from '../../../shared/snack/snack.component'
import {TranslateService} from '@ngx-translate/core';

;

@Component({
    selector: 'jhi-accountsdb-delete',
    templateUrl: './accountsdb-delete.component.html',
    styles: []
})
export class AccountsdbDeleteComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private accountsService: AccountsService,
                private router: Router,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {
    }

    ngOnInit() {
    }

    onDelete() {
        const message = this.translateService.instant('ninjaccountApp.accountsDB.details.deletePopup.snack');
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.duration = 3000;
        config.data = {icon: 'fa-check-circle-o', text: message};
        this.snackBar.openFromComponent(SnackComponent, config);

        this.accountsService.deleteAccount(this.data.id);
        this.router.navigate(['/accounts']);
    }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account } from '../../../shared/account/account.model';
import { MatDialogRef } from '@angular/material';
import { isUndefined } from 'util';
import { saveAs as importedSaveAs } from 'file-saver';
import { SnackUtilService } from '../../../shared/snack/snack-util.service';
import { AccountsDBService } from 'app/entities/accounts-db';

@Component({
    selector: 'jhi-export-all-accounts',
    templateUrl: './export-all-accounts.component.html',
    styleUrls: ['./export-all-accounts.component.scss']
})
export class ExportAllAccountsComponent implements OnInit, OnDestroy {
    separator = '","';

    constructor(
        private accountsService: AccountsDBService,
        private dialogRef: MatDialogRef<ExportAllAccountsComponent>,
        private snackUtil: SnackUtilService
    ) {}

    ngOnInit() {}

    ngOnDestroy(): void {}

    onAllExport() {
        const accounts = this.accountsService.getAccountsListInstant();
        if (accounts.length !== 0) {
            let lines = '';
            const header = 'Id,Name,Number,Username,Password,Notes,Fields,Tags,Url';
            lines += lines.concat(header).concat('\n');

            accounts.forEach((account: Account) => {
                let line = '';
                line += '"' + account.id.toString() + this.separator;
                line += account.name + this.separator;

                if (isUndefined(account.number)) {
                    line += this.separator;
                } else {
                    line += account.number + this.separator;
                }

                line += account.username + this.separator;
                line += account.password + this.separator;

                if (isUndefined(account.notes)) {
                    line += this.separator;
                } else {
                    line += account.notes + this.separator;
                }

                account.customs.forEach(custom => (line += custom.key + ' - ' + custom.value + ' / '));
                if (account.customs.length !== 0) {
                    line = line.slice(0, -3);
                }
                line += this.separator;

                account.tags.forEach(tag => (line += tag + ' - '));
                if (account.tags.length !== 0) {
                    line = line.slice(0, -3);
                }
                line += this.separator;

                line += account.url + '"';

                line += '\n';

                lines += line;
            });

            const blob = new Blob([lines], { type: 'text/csv' });
            importedSaveAs(blob, 'export-accounts.csv');
            this.dialogRef.close('export over');
            this.snackUtil.openSnackBar('settings.danger.export.success', 5000, 'check-circle', { nbExportedAccount: accounts.length });
        } else {
            this.snackUtil.openSnackBar('settings.danger.export.nodata', 5000, 'exclamation-triangle');
        }
    }
}

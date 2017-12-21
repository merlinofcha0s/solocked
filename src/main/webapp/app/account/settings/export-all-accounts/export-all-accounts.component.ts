import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountsService} from '../../../shared/account/accounts.service';
import {Account} from '../../../shared/account/account.model';
import {MatDialogRef} from '@angular/material';
import {isUndefined} from 'util';
import {saveAs as importedSaveAs} from 'file-saver';

@Component({
    selector: 'jhi-export-all-accounts',
    templateUrl: './export-all-accounts.component.html',
    styleUrls: ['./export-all-accounts.component.scss']
})
export class ExportAllAccountsComponent implements OnInit, OnDestroy {

    separator = ','

    constructor(private accountsService: AccountsService,
                private dialogRef: MatDialogRef<ExportAllAccountsComponent>) {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    onAllExport() {
        const accounts = this.accountsService.getAccountsListInstant();
        if (accounts.length !== 0) {
            let lines = '';
            const header = 'Id,Name,Number,Username,Password,Notes,Fields,Tags';
            lines += lines.concat(header).concat('\n');

            accounts.forEach((account: Account) => {
                let line = '';
                line += account.id.toString() + this.separator;
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

                account.customs.forEach((custom) => line += custom.key + ' - ' + custom.value + ' / ');
                line += this.separator;
                account.tags.forEach((tags) => line += tags + ' ');
                line += this.separator;

                line += '\n';

                lines += line;
            });

            const blob = new Blob([lines], {type: 'text/csv'});
            importedSaveAs(blob, 'export-accounts.csv');
            this.dialogRef.close('export over');
        }
    }

}

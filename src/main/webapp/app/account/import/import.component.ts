import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TypeImport } from './model/type-import.enum';
import { Account } from '../../shared/account/account.model';
import { SnackUtilService } from '../../shared/snack/snack-util.service';
import { AccountsDBService } from '../../entities/accounts-db';
import { Custom } from '../../shared/account/custom-account.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jhi-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit, OnDestroy {
    TypeImport: typeof TypeImport = TypeImport;

    importForm: FormGroup;
    importType: FormControl;

    private importTypeValue: TypeImport;
    private importTypeValueGuess: TypeImport;

    private newAccounts: Array<Account>;

    private lastPassHeader = 'url,username,password,extra,name,grouping,fav';
    private onePasswordHeader = 'ainfo,autosubmit,custom,email,master-password,notesPlain,password,scope,secret key,section:r7xrdwk6iz6totkcjlrvnmo524,' +
        'section:Section_p44bcbwngagpmb4qm2svcwxpku,tags,title,urls,username,uuid';
    private csvHeader = 'Id,Name,Number,Username,Password,Notes,Fields,Tags,Url';
    private keepassHeader = '"Account","Login Name","Password","Web Site","Comments"';

    loading: boolean;
    preloadOk: boolean;

    lineInError: number;
    private lineInTotal: number;

    displayCSVInformation: boolean;

    actualAndMaxNumber$: BehaviorSubject<any>;
    actualAndMaxNumberOnSubmitSub: Subscription;
    actualAndMaxNumberOnExportSub: Subscription;

    constructor(private formBuilder: FormBuilder, private snackUtil: SnackUtilService, private accountsDBService: AccountsDBService) {
        this.actualAndMaxNumber$ = this.accountsDBService.actualAndMaxNumber$;
    }

    ngOnInit() {
        this.initForm();
    }

    ngOnDestroy(): void {
        if (this.actualAndMaxNumberOnSubmitSub) {
            this.actualAndMaxNumberOnSubmitSub.unsubscribe();
        }

        if (this.actualAndMaxNumberOnExportSub) {
            this.actualAndMaxNumberOnExportSub.unsubscribe();
        }
    }

    initForm() {
        this.importType = this.formBuilder.control('', Validators.required);

        this.importForm = this.formBuilder.group({
            importType: this.importType
        });

        this.preloadOk = false;
    }

    onSubmitImport() {
        this.loading = true;
        this.importTypeValue = this.importType.value;
        if (this.importTypeValue === this.importTypeValueGuess) {
            const nbActualAccount = this.accountsDBService.getAccountsListInstant().length;
            this.actualAndMaxNumberOnSubmitSub = this.actualAndMaxNumber$
                .concatMap(actualAndMax => this.accountsDBService.saveNewAccount(this.newAccounts))
                .flatMap(account => this.accountsDBService.updateActualNumberAccount(nbActualAccount + this.newAccounts.length))
                .subscribe(response => {
                    this.snackUtil.openSnackBar('import.success', 5000, 'fa-check-circle', { nbImportedAccount: this.newAccounts.length });
                    this.loading = false;
                });
        } else {
            this.loading = false;
            this.snackUtil.openSnackBar('import.error.wrongchoiceformat', 5000, 'fa-exclamation-triangle');
        }
    }

    onFileChange(event: any) {
        this.lineInError = 0;
        this.lineInTotal = 0;
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            const file = event.target.files[0];
            reader.readAsText(file);
            reader.onload = () => {
                this.prepareImport(reader.result);
            };
        }
    }

    prepareImport(importFile: string) {
        this.importTypeValueGuess = this.verifyImportType(importFile);
        if (this.importTypeValueGuess !== TypeImport.NONE) {
            this.actualAndMaxNumberOnExportSub = this.actualAndMaxNumber$.subscribe(actualAndMax => {
                const lines = this.extract(importFile);
                switch (this.importTypeValueGuess) {
                    case TypeImport.LASTPASS:
                        this.newAccounts = this.createAccountFromLastPass(lines);
                        break;
                    case TypeImport.ONEPASSWORD:
                        this.newAccounts = this.createAccountFromOnePassword(lines);
                        break;
                    case TypeImport.DASHLANE:
                        this.newAccounts = this.createAccountFromDashLane(lines);
                        break;
                    case TypeImport.CSV:
                        this.newAccounts = this.createAccountFromCSV(lines);
                        break;
                    case TypeImport.KEEPASS2:
                        this.newAccounts = this.createAccountFromKeepass2(lines);
                        break;
                }

                if (actualAndMax.first + this.newAccounts.length <= actualAndMax.second) {
                    this.preloadOk = true;
                } else {
                    this.snackUtil.openSnackBar('import.error.toomanyaccount', 10000, 'fa-exclamation-triangle', {
                        actual: actualAndMax.first,
                        nbOfNewAccount: this.newAccounts.length,
                        max: actualAndMax.second
                    });
                    this.preloadOk = false;
                }
            });
        } else {
            this.snackUtil.openSnackBar('import.error.formatunknown', 5000, 'fa-exclamation-triangle');
        }
    }

    verifyImportType(importFile: string): TypeImport {
        const firstLine = importFile.split('\n')[0].trim();
        switch (firstLine) {
            case this.lastPassHeader:
                return TypeImport.LASTPASS;
            case this.onePasswordHeader:
                return TypeImport.ONEPASSWORD;
            case this.csvHeader:
                return TypeImport.CSV;
            case this.keepassHeader:
                return TypeImport.KEEPASS2;
        }

        if (firstLine.includes('@')) {
            return TypeImport.DASHLANE;
        } else {
            return TypeImport.NONE;
        }
    }

    extract(importFile: string): Array<string> {
        const linesWithHeader = importFile.split('\n');
        // Skip the header
        return linesWithHeader.slice(1, linesWithHeader.length);
    }

    createAccountFromOnePassword(lines: Array<string>): Array<Account> {
        const newAccounts = [];
        // Remove and return the last row (\n on the 1Password file)
        lines.pop();
        lines.forEach(line => {
            const fields = line.replace(/","/g, ',-').split(',-');
            const notes = fields[5].trim();
            const password = fields[6].trim();
            const tags = fields[11].trim();
            const title = fields[12].trim();
            const url = fields[13].trim();
            const username = fields[14].trim();

            const newAccount = new Account(username, password, title);
            newAccount.url = url;
            if (tags !== '') {
                newAccount.tags.push(tags);
            }
            newAccount.notes = notes;

            newAccounts.push(newAccount);
        });
        return newAccounts;
    }

    createAccountFromLastPass(lines: Array<string>): Array<Account> {
        const newAccounts = [];
        lines.forEach(line => {
            const fields = line.split(',');
            const url = fields[0].trim();
            const username = fields[1].trim();
            const password = fields[2].trim();
            const name = fields[4].trim();
            const grouping = fields[5].trim();

            const newAccount = new Account(username, password, name);
            newAccount.url = url;
            newAccount.tags.push(grouping);

            newAccounts.push(newAccount);
        });
        return newAccounts;
    }

    createAccountFromDashLane(lines: Array<string>): Array<Account> {
        const newAccounts = [];
        lines.forEach(line => {
            const fields = line.replace(/","/g, ',-').split(',-');
            let name = fields[0].replace('"', '').trim();
            name = name.charAt(0).toUpperCase() + name.substring(1);
            const url = fields[1].trim();
            const username = fields[2].trim();
            const password = fields[3].trim();
            const notes = fields[4].trim();

            const newAccount = new Account(username, password, name);
            newAccount.url = url;
            newAccount.notes = notes;

            newAccounts.push(newAccount);
        });
        return newAccounts;
    }

    createAccountFromCSV(lines: Array<string>): Array<Account> {
        const newAccounts = [];
        // Delete the last line, we avoid an empty line, we generate it with \n at the end of the file
        lines.pop();
        this.lineInTotal = lines.length;
        lines.forEach(line => {
            const fields = line.replace(/","/g, ',-').split(',-');
            try {
                let name = fields[1].trim();
                name = name.charAt(0).toUpperCase() + name.substring(1);
                const username = fields[3].trim();
                const password = fields[4].trim();
                const notes = fields[5].trim();
                const fieldsField = fields[6].trim().split('/');
                const tags = fields[7].trim().split(' - ');
                const url = fields[8].trim().replace('"', '');

                const newAccount = new Account(username, password, name);
                newAccount.url = url;
                newAccount.notes = notes;

                for (const field of fieldsField) {
                    if (field !== '') {
                        const label = field.split(' - ')[0];
                        const value = field.split(' - ')[1];
                        const custom = new Custom(label, value);
                        newAccount.customs.push(custom);
                    }
                }

                for (const tag of tags) {
                    if (tag !== name) {
                        newAccount.tags.push(tag);
                    }
                }

                newAccounts.push(newAccount);
            } catch (e) {
                this.lineInError++;
            }
        });
        return newAccounts;
    }

    createAccountFromKeepass2(lines: Array<string>): Array<Account> {
        const newAccounts = [];
        // Delete the last line, we avoid an empty line, we generate it with \n at the end of the file
        lines.pop();
        lines.forEach(line => {
            const fields = line.replace(/","/g, ',-').split(',-');
            let name = fields[0].replace('"', '').trim();
            name = name.charAt(0).toUpperCase() + name.substring(1);
            const username = fields[1].trim();
            const password = fields[2].trim();
            const url = fields[3].trim().replace('"', '');
            const notes = fields[4].trim().replace('"', '');

            const newAccount = new Account(username, password, name);
            newAccount.url = url;
            newAccount.notes = notes;

            newAccounts.push(newAccount);
        });
        return newAccounts;
    }

    onTypeSelected(importType: TypeImport) {
        if (importType === TypeImport.CSV) {
            this.displayCSVInformation = true;
        } else {
            this.displayCSVInformation = false;
        }
    }
}

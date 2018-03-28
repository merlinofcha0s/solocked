import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TypeImport} from "./model/type-import.enum";
import {Account} from "../../shared/account/account.model";
import {isUndefined} from "util";
import {AccountsService} from "../../shared/account/accounts.service";

@Component({
    selector: 'jhi-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

    TypeImport: typeof TypeImport = TypeImport;

    importForm: FormGroup;
    importType: FormControl;

    private importTypeValue: TypeImport;
    private importTypeValueGuess: TypeImport;

    private newAccounts: Array<Account>;

    private lastPassHeader = "url,username,password,extra,name,grouping,fav";

    constructor(private formBuilder: FormBuilder, private accountService: AccountsService) {
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.importType = this.formBuilder.control('');

        this.importForm = this.formBuilder.group({
            importType: this.importType
        });
    }

    onSubmitImport() {
        this.importTypeValue = this.importType.value;

        if (!isUndefined(this.newAccounts) && this.importTypeValue === this.importTypeValueGuess) {
            console.log("Everything ok !!!!");
            this.newAccounts.forEach(newAccount => {
                this.accountService.saveNewAccount(newAccount).subscribe(account => {
                    console.log('Okay');
                });
            });
        } else {
            //Mettre une erreur
        }
    }

    onFileChange(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.readAsText(file);
            reader.onload = () => {
                console.log(reader.result);
                this.prepareImport(reader.result);
            };
        }
    }

    prepareImport(importFile: string) {
        this.importTypeValueGuess = this.verifyImportType(importFile);
        console.log('TypeImport: ' + this.importTypeValueGuess.toString());
        if (this.importTypeValueGuess !== TypeImport.NONE) {
            const lines = this.extract(importFile);
            switch (this.importTypeValueGuess) {
                case TypeImport.LASTPASS:
                    this.newAccounts = this.createAccountFromLastPass(lines);
                    console.log('New accounts converted : ' + this.newAccounts.length);
                    break;
            }
        } else {
            //Mettre une erreur
        }
    }

    verifyImportType(importFile: string): TypeImport {
        const firstLine = importFile.split('\n')[0].trim();
        console.log('first Line : ' + firstLine);
        console.log('header hardcoded : ' + this.lastPassHeader);
        switch (firstLine) {
            case this.lastPassHeader:
                return TypeImport.LASTPASS;
            default:
                return TypeImport.NONE;
        }
    }

    extract(importFile: string): Array<string> {
        const linesWithHeader = importFile.split('\n');
        //Skip the header
        return linesWithHeader.slice(1, linesWithHeader.length);
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
            const pined = fields[6].trim();

            const newAccount = new Account(username, password, name);
            newAccount.featured = Boolean(Number(pined));
            newAccount.url = url;
            newAccount.tags.push(name);
            newAccount.tags.push(grouping);

            newAccounts.push(newAccount);
        });
        return newAccounts;
    }
}

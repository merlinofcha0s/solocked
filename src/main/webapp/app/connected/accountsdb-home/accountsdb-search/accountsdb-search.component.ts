import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'ngx-webstorage';
import { isUndefined } from 'util';
import { LAST_SEARCH } from 'app/shared/constants/session-storage.constants';
import { AccountsDBService } from 'app/entities/accounts-db';
import { Subscription } from 'rxjs';

@Component({
    selector: 'jhi-accountsdb-search',
    templateUrl: './accountsdb-search.component.html',
    styleUrls: ['./accountsdb-search.component.scss']
})
export class AccountsdbSearchComponent implements OnInit, OnDestroy {
    @Input() nbResults: number;
    @Output() filterTerms = new EventEmitter<string>();
    @Output() displayAll = new EventEmitter<boolean>();

    accountsSub: Subscription;

    searchForm: FormGroup;
    searchControl: FormControl;

    totalNumberAccount: number;

    param = { nbResult: '{{nbResults}}' };

    constructor(private fb: FormBuilder, private sessionStorage: SessionStorageService, private accountsService: AccountsDBService) {}

    ngOnInit() {
        this.initForm();
        this.retrieveLastSearch();
    }

    ngOnDestroy(): void {
        this.accountsSub.unsubscribe();
    }

    initForm() {
        this.searchControl = this.fb.control('');
        this.searchForm = this.fb.group({
            searchControl: this.searchControl
        });

        this.searchControl.valueChanges.subscribe(value => {
            if (value || value === '') {
                this.displayAll.emit(false);
                this.filterTerms.emit(value);
            }
        });

        this.accountsSub = this.accountsService.accounts$.subscribe(accounts => {
            console.log(accounts.length);
            this.totalNumberAccount = accounts.length;
        });
    }

    retrieveLastSearch() {
        const lastSearch = this.sessionStorage.retrieve(LAST_SEARCH);
        if (!isUndefined(lastSearch)) {
            this.searchControl.setValue(lastSearch, {
                onlySelf: false,
                emitEvent: true,
                emitModelToViewChange: false,
                emitViewToModelChange: false
            });
        }
    }

    clearSearch() {
        this.searchControl.setValue('');
    }

    search() {}

    onClickAllAccounts() {
        this.searchControl.setValue('');
        this.displayAll.emit(true);
    }
}

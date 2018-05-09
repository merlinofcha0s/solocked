import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {LAST_SEARCH} from '../../../shared';
import {SessionStorageService} from 'ngx-webstorage';
import {isUndefined} from 'util';
import {Subscription} from 'rxjs/Subscription';
import {Account} from '../../../shared/account/account.model';
import {AccountsService} from '../../../shared/account/accounts.service';

@Component({
    selector: 'jhi-accountsdb-search',
    templateUrl: './accountsdb-search.component.html',
    styleUrls: ['./accountsdb-search.component.scss']
})
export class AccountsdbSearchComponent implements OnInit, OnDestroy {

    @Input() nbResults: number;
    @Output() filterTerms = new EventEmitter<string>();

    accountsSub: Subscription;
    accounts: Array<Account>;

    searchForm: FormGroup;
    searchControl: FormControl;

    totalNumberAccount: number;

    constructor(private fb: FormBuilder,
                private sessionStorage: SessionStorageService,
                private accountsService: AccountsService) {
    }

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
            searchControl: this.searchControl,
        });

        this.searchControl.valueChanges.subscribe((value) => {
            if(value){
                this.filterTerms.emit(value);
            }
        });

        this.accountsSub = this.accountsService.accounts$.subscribe((accounts) => {
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

    search() {

    }
}

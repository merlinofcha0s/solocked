import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AccountsService} from '../../../shared/account/accounts.service';
import {Account} from '../../../shared/account/account.model';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {Router} from '@angular/router';
import {SearchService} from '../../../shared/search/search.service';
import {SessionStorageService} from 'ngx-webstorage';
import {LAST_SEARCH} from '../../../shared';

@Component({
    selector: 'jhi-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    searchForm: FormGroup;
    searchControl: FormControl;

    accounts: Array<Account>;
    filteredAccounts: Observable<Array<Account>>;

    accountsSub: Subscription;

    constructor(private fb: FormBuilder,
                private accountsService: AccountsService,
                private router: Router,
                private searchService: SearchService,
                private sessionStorage: SessionStorageService) {
    }

    ngOnInit() {
        this.initForm();
        this.initAccounts();
    }

    ngOnDestroy(): void {
        this.accountsSub.unsubscribe();
    }

    initAccounts() {
        this.accountsSub = this.accountsService.accounts$.subscribe((accounts) => {
            this.accounts = accounts;
            this.filteredAccounts = this.searchControl.valueChanges.map((name) => name ? this.searchService.filter(name, this.accounts) : []);
        });
    }

    initForm() {
        this.searchControl = this.fb.control('');
        this.searchForm = this.fb.group({
            searchControl: this.searchControl,
        });
    }

    onAccountSelected(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
        this.router.navigate(['/accounts/edit', matAutocompleteSelectedEvent.option.value.id]);
    }

    displayFn(account: Account): string | Account {
        return account ? account.name : account;
    }

    clearSearch() {
        this.searchControl.setValue('');
    }

    onHomePageSearch(valueToSearch: String | Account) {
        // We enforce that is a string, since the valueToSearch can be an account
        if (typeof(valueToSearch) === 'string' || valueToSearch instanceof String) {
            this.sessionStorage.store(LAST_SEARCH, valueToSearch);
            this.router.navigate(['/accounts']);
        } else {
            this.router.navigate(['/accounts/edit', valueToSearch.id]);
        }
    }
}

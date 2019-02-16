import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Event, NavigationEnd, Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SearchService } from 'app/shared/search/search.service';
import { LAST_SEARCH } from 'app/shared/constants/session-storage.constants';
import { Account } from 'app/shared/account/account.model';
import { AccountsHomeRouteName } from 'app/connected';
import { AccountsDBService } from 'app/entities/accounts-db';
import { map } from 'rxjs/operators';

@Component({
    selector: 'jhi-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    animations: [
        trigger('appear', [
            state('void', style({ opacity: 0.0 })),
            state('*', style({ opacity: 1 })),
            transition('void => *, * => void', animate('500ms  ease-in-out'))
        ])
    ]
})
export class SearchComponent implements OnInit, OnDestroy {
    searchForm: FormGroup;
    searchControl: FormControl;

    accounts: Array<Account>;
    filteredAccounts: Observable<Array<Account>>;

    accountsSub: Subscription;
    routerSub: Subscription;

    showSearch: boolean;

    constructor(
        private fb: FormBuilder,
        private accountsService: AccountsDBService,
        private router: Router,
        private searchService: SearchService,
        private sessionStorage: SessionStorageService
    ) {}

    ngOnInit() {
        this.initForm();
        this.initAccounts();
        this.initShowHide();
    }

    ngOnDestroy(): void {
        this.accountsSub.unsubscribe();
        this.routerSub.unsubscribe();
    }

    initAccounts() {
        this.accountsSub = this.accountsService.accounts$.subscribe(accounts => {
            this.accounts = accounts;
            this.filteredAccounts = this.searchControl.valueChanges.pipe(
                map(value => {
                    // Means that it's an account : it happened when the user click on an item on the autocomplete
                    // So we extract the name of the account
                    if (value instanceof Object === false) {
                        this.sessionStorage.store(LAST_SEARCH, value);
                    }

                    return value ? this.searchService.filter(value, this.accounts) : [];
                })
            );
        });
    }

    initForm() {
        this.searchControl = this.fb.control('');
        this.searchForm = this.fb.group({
            searchControl: this.searchControl
        });
        this.searchControl.setValue('');
    }

    onAccountSelected(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
        this.searchControl.setValue(this.sessionStorage.retrieve(LAST_SEARCH));
        this.router.navigate(['/accounts/edit', matAutocompleteSelectedEvent.option.value.id]);
    }

    displayFn(account: Account): string | Account {
        if (account instanceof Object) {
            return account.name;
        } else {
            return account;
        }
    }

    clearSearch() {
        this.searchControl.setValue('');
    }

    onHomePageSearch(valueToSearch: String | Account) {
        // We enforce that is a string, since the valueToSearch can be an account
        if (typeof valueToSearch === 'string' || valueToSearch instanceof String) {
            this.sessionStorage.store(LAST_SEARCH, valueToSearch);
            this.router.navigate(['/' + AccountsHomeRouteName]);
        } else {
            this.router.navigate(['/accounts/edit', valueToSearch.id]);
        }
    }

    initShowHide() {
        // The case where the user has reload the browser because the subscribe is not working in this case
        if (this.router.routerState.snapshot.url === '/' + AccountsHomeRouteName) {
            this.showSearch = false;
        } else {
            this.showSearch = true;
            this.searchControl.setValue(this.sessionStorage.retrieve(LAST_SEARCH));
        }

        this.routerSub = this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/' + AccountsHomeRouteName) {
                    this.showSearch = false;
                } else {
                    this.showSearch = true;
                    this.searchControl.setValue(this.sessionStorage.retrieve(LAST_SEARCH));
                }
            }
        });
    }
}

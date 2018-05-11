import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AccountsService} from '../../../shared/account/accounts.service';
import {Account} from '../../../shared/account/account.model';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {Event, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {SearchService} from '../../../shared/search/search.service';
import {SessionStorageService} from 'ngx-webstorage';
import {LAST_SEARCH} from '../../../shared/index';
import {AccountsHomeRouteName} from '../../../connected';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'jhi-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    animations: [
        trigger('appear', [
            state('void', style({opacity: 0.0})),
            state('*', style({opacity: 1})),
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

    constructor(private fb: FormBuilder,
                private accountsService: AccountsService,
                private router: Router,
                private searchService: SearchService,
                private sessionStorage: SessionStorageService) {

    }

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
        this.accountsSub = this.accountsService.accounts$.subscribe((accounts) => {
            this.accounts = accounts;
            this.filteredAccounts = this.searchControl.valueChanges.map((name) => {
                this.sessionStorage.store(LAST_SEARCH, name);
                return name ? this.searchService.filter(name, this.accounts) : [];
            });
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
        if (typeof(valueToSearch) === 'string' || valueToSearch instanceof String) {
            this.sessionStorage.store(LAST_SEARCH, valueToSearch);
            this.router.navigate(['/accounts']);
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

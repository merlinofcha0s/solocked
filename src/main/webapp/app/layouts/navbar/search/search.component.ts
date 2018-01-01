import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AccountsService} from '../../../shared/account/accounts.service';
import {Account} from '../../../shared/account/account.model';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';
import {startWith} from 'rxjs/operators/startWith';
import {Subscription} from 'rxjs/Subscription';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {Router} from '@angular/router';
import {filter} from 'rxjs/operator/filter';

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
    filteredAccountsSub: Subscription;

    constructor(private fb: FormBuilder,
                private accountsService: AccountsService,
                private router: Router) {}

    ngOnInit() {
        this.initForm();
        this.initAccounts();
    }

    ngOnDestroy(): void {
        this.accountsSub.unsubscribe();
        if (this.filteredAccountsSub) {
            this.filteredAccountsSub.unsubscribe();
        }
    }

    initAccounts() {
        this.accountsSub = this.accountsService.accounts$.subscribe((accounts) => {
            this.accounts = accounts;

            if (this.filteredAccountsSub) {
                this.filteredAccountsSub.unsubscribe();
            }

            this.filteredAccounts = this.searchControl.valueChanges
                .pipe(
                    startWith({} as Account),
                    map((account) => account && typeof account === 'object' ? account.name : account),
                    map((name) => name ? this.filter(name) : [])
                );
        });
    }

    filter(val: any): Account[] {
        if (val.length >= 2) {
            return this.accounts.filter((account) => {
                const joined = account.tags.join(' ');
                return joined.toLowerCase().indexOf(val.toLowerCase()) !== -1;
            });
        }
        return [];
    }

    initForm() {
        this.searchControl = this.fb.control('');
        this.searchForm = this.fb.group({
            searchControl: this.searchControl,
        });
    }

    onAccountSelected(matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent) {
        this.router.navigate(['/accounts/details', matAutocompleteSelectedEvent.option.value.id]);
    }

    displayFn(account: Account): string | Account {
        return account ? account.name : account;
    }

    search() {
    }

    clearSearch() {
        this.searchControl.setValue('');
    }
}

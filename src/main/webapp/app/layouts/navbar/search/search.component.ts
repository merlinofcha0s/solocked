import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountsService} from "../../../shared/account/accounts.service";
import {Account} from "../../../shared/account/account.model";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/operators/map';
import {startWith} from 'rxjs/operators/startWith';
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'jhi-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    searchForm: FormGroup;
    search: FormControl;

    accounts: Array<Account>;
    filteredAccounts: Observable<Array<any>>;

    accountsSub: Subscription;
    filteredAccountsSub: Subscription;

    constructor(private fb: FormBuilder, private accountsService: AccountsService) {

    }

    initAccounts() {
        this.accountsSub = this.accountsService.accounts$.subscribe((accounts) => {
            this.accounts = accounts;

            if (this.filteredAccountsSub) {
                this.filteredAccountsSub.unsubscribe();
            }

            this.filteredAccounts = this.search.valueChanges
                .pipe(
                    startWith(''),
                    map(val => val ? this.filter(val) : this.accounts.slice())
                );
        });
    }

    filter(val: string): Account[] {
        return this.accounts.filter((account) => {
            const joined = account.tags.join(' ');
            return joined.toLowerCase().indexOf(val.toLowerCase()) !== -1;
        });
    }

    initForm() {
        this.search = this.fb.control('');
        this.searchForm = this.fb.group({
            search: this.search,
        });
    }

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

    // onAccountSelected() {
    //     console.log('selected : '  +  )
    // }
}

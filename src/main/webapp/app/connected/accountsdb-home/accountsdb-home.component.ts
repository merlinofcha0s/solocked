import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { PaymentService } from 'app/entities/payment';
import { SearchService } from 'app/shared/search/search.service';
import { LAST_SEARCH } from 'app/shared/constants/session-storage.constants';
import { Account } from 'app/shared/account/account.model';
import { AccountsDBService } from 'app/entities/accounts-db';
import { Subscription } from 'rxjs';
import { AccountService } from 'app/core';

@Component({
    selector: 'jhi-accountdb-home',
    templateUrl: './accountsdb-home.component.html',
    styleUrls: ['./accountsdb-home.component.scss']
})
export class AccountsdbHomeComponent implements OnInit, OnDestroy {
    accountsSub: Subscription;
    accounts: Array<Account>;
    allAccountsPaginated: Array<Account>;
    counter: number;
    pageSize = 10;

    filteredAccounts: Array<Account>;

    displayLoadMore: boolean;

    lastSearchTerms: string;

    nbResults: number;

    displayAll: boolean;

    constructor(
        private accountsService: AccountsDBService,
        private paymentService: PaymentService,
        private accountService: AccountService,
        private searchService: SearchService,
        private sessionStorage: SessionStorageService
    ) {
        this.counter = 0;
        this.lastSearchTerms = '';
        this.allAccountsPaginated = [];
        this.filteredAccounts = [];
        this.nbResults = 0;
    }

    ngOnInit() {
        this.initAccountsList();
        this.paymentService.getPaymentByLogin();
    }

    ngOnDestroy(): void {
        this.accountsSub.unsubscribe();
        this.sessionStorage.store(LAST_SEARCH, this.lastSearchTerms);
    }

    initAccountsList() {
        this.accountsSub = this.accountsService.accounts$.subscribe(accounts => {
            this.accounts = accounts;

            if (this.accounts.length !== 0) {
                // Retain the position of the pager
                if (this.counter !== 0) {
                    this.allAccountsPaginated = [];
                    this.pageSize = this.counter;
                    this.counter = 0;
                }

                this.onFilter(this.lastSearchTerms);
            }
        });
    }

    getNextPage() {
        let offset = 0;
        for (let i = this.counter; i < this.filteredAccounts.length; i++) {
            this.allAccountsPaginated.push(this.filteredAccounts[i]);
            offset += 1;
            if (offset === this.pageSize) {
                break;
            }
        }
        this.counter += offset;
        this.displayLoadMore = this.counter < this.filteredAccounts.length;
    }

    onFilter(filterTerms) {
        this.counter = 0;
        this.lastSearchTerms = filterTerms;
        this.allAccountsPaginated.splice(0, this.allAccountsPaginated.length);
        // Avoiding the problem of change detection when angular runs it !
        // (https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4)
        Promise.resolve(null).then(() => (this.nbResults = this.filteredAccounts.length));

        if (this.displayAll) {
            this.filteredAccounts = this.accounts;
        } else {
            this.filteredAccounts = this.searchService.filter(filterTerms, this.accounts);
        }

        this.getNextPage();
    }

    onDisplayAll(displayAll) {
        this.displayAll = displayAll;
        if (displayAll) {
            this.onFilter('');
        }
    }
}

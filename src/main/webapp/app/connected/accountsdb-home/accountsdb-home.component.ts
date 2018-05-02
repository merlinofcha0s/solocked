import {AccountsService} from './../../shared/account/accounts.service';
import {Account} from '../../shared/account/account.model';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from '../../entities/payment/payment.service';
import {Subscription} from 'rxjs/Subscription';
import {Principal} from '../../shared';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SearchService} from '../../shared/search/search.service';

declare var $crisp: any;

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

    seeAll = false;

    filteredAccounts$: Observable<Array<Account>>;
    filteredAccounts: Array<Account>;
    filterTerms: BehaviorSubject<any>;

    displayLoadMore: boolean;

    lastSearchTerms: string;

    constructor(private accountsService: AccountsService,
                private paymentService: PaymentService,
                private principal: Principal,
                private searchService: SearchService) {
        this.counter = 0;
        this.lastSearchTerms = '';
        this.allAccountsPaginated = [];
        this.filteredAccounts = [];
    }

    ngOnInit() {
        this.initAccountsList();
        this.paymentService.getPaymentByLogin();
        this.initCrispData();
    }

    ngOnDestroy(): void {
        this.accountsSub.unsubscribe();
    }

    initAccountsList() {
        this.filterTerms = new BehaviorSubject<string>('');
        this.accountsSub = this.accountsService.accounts$.subscribe((accounts) => {
            this.accounts = accounts;

            // In case of the user has clicked on the featured :
            // we have to update the list and set paginator at the exact same place as the user was
            if (this.counter !== 0) {
                this.allAccountsPaginated = [];
                this.pageSize = this.counter;
                this.counter = 0;
            }
            this.filterTerms.next(this.lastSearchTerms);
            this.getNextPage();
        });

        this.filteredAccounts$ = this.filterTerms
            .map((terms) => terms ? this.searchService.filter(terms, this.accounts) : []);

        this.filteredAccounts$.subscribe((accounts) => {
            this.filteredAccounts = accounts;
            this.getNextPage();
        });

        this.accountsService.getAccountsList();
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

    initCrispData() {
        this.principal.identity(true).then((account) => {
            if (typeof $crisp !== 'undefined') {
                $crisp.push(['set', 'user:nickname', account.login]);
            }
        });
    }

    onFilter(filterTerms) {
        this.counter = 0;
        this.lastSearchTerms = filterTerms;
        this.allAccountsPaginated.splice(0, this.allAccountsPaginated.length);
        this.filterTerms.next(filterTerms);
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { AccountsDB } from './accounts-db.model';
import { AccountsDBService } from './accounts-db.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-accounts-db',
    templateUrl: './accounts-db.component.html'
})
export class AccountsDBComponent implements OnInit, OnDestroy {
accountsDBS: AccountsDB[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private accountsDBService: AccountsDBService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.accountsDBService.query().subscribe(
            (res: ResponseWrapper) => {
                this.accountsDBS = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInAccountsDBS();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AccountsDB) {
        return item.id;
    }
    registerChangeInAccountsDBS() {
        this.eventSubscriber = this.eventManager.subscribe('accountsDBListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

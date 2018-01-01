import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { AccountsDB } from './accounts-db.model';
import { AccountsDBService } from './accounts-db.service';
import { Principal, ResponseWrapper } from '../../shared';

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
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
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

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInAccountsDBS() {
        this.eventSubscriber = this.eventManager.subscribe('accountsDBListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiAlertService, JhiDataUtils, JhiEventManager } from 'ng-jhipster';

import { ISrp } from 'app/shared/model/srp.model';
import { AccountService } from 'app/core';
import { SrpService } from './srp.service';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'jhi-srp',
    templateUrl: './srp.component.html'
})
export class SrpComponent implements OnInit, OnDestroy {
    srps: ISrp[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected srpService: SrpService,
        protected jhiAlertService: JhiAlertService,
        protected dataUtils: JhiDataUtils,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.srpService
            .query()
            .pipe(
                filter((res: HttpResponse<ISrp[]>) => res.ok),
                map((res: HttpResponse<ISrp[]>) => res.body)
            )
            .subscribe(
                (res: ISrp[]) => {
                    this.srps = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInSrps();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ISrp) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    registerChangeInSrps() {
        this.eventSubscriber = this.eventManager.subscribe('srpListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}

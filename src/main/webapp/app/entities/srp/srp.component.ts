import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiAlertService, JhiDataUtils, JhiEventManager } from 'ng-jhipster';

import { ISrp } from 'app/shared/model/srp.model';
import { Principal } from 'app/core';
import { SrpService } from './srp.service';

@Component({
    selector: 'jhi-srp',
    templateUrl: './srp.component.html'
})
export class SrpComponent implements OnInit, OnDestroy {
    srps: ISrp[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private srpService: SrpService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.srpService.query().subscribe(
            (res: HttpResponse<ISrp[]>) => {
                this.srps = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
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

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ISrp } from 'app/shared/model/srp.model';

@Component({
    selector: 'jhi-srp-detail',
    templateUrl: './srp-detail.component.html'
})
export class SrpDetailComponent implements OnInit {
    srp: ISrp;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ srp }) => {
            this.srp = srp;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    previousState() {
        window.history.back();
    }
}

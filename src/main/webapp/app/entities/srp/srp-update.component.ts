import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ISrp } from 'app/shared/model/srp.model';
import { SrpService } from './srp.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-srp-update',
    templateUrl: './srp-update.component.html'
})
export class SrpUpdateComponent implements OnInit {
    isSaving: boolean;
    users: IUser[];

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private srpService: SrpService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    private _srp: ISrp;

    get srp() {
        return this._srp;
    }

    set srp(srp: ISrp) {
        this._srp = srp;
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ srp }) => {
            this.srp = srp;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.srp.id !== undefined) {
            this.subscribeToSaveResponse(this.srpService.update(this.srp));
        } else {
            this.subscribeToSaveResponse(this.srpService.create(this.srp));
        }
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ISrp>>) {
        result.subscribe((res: HttpResponse<ISrp>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}

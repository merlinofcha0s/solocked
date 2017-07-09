import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AccountsDB } from './accounts-db.model';
import { AccountsDBPopupService } from './accounts-db-popup.service';
import { AccountsDBService } from './accounts-db.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-accounts-db-dialog',
    templateUrl: './accounts-db-dialog.component.html'
})
export class AccountsDBDialogComponent implements OnInit {

    accountsDB: AccountsDB;
    authorities: any[];
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private accountsDBService: AccountsDBService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.accountsDB.id !== undefined) {
            this.subscribeToSaveResponse(
                this.accountsDBService.update(this.accountsDB));
        } else {
            this.subscribeToSaveResponse(
                this.accountsDBService.create(this.accountsDB));
        }
    }

    private subscribeToSaveResponse(result: Observable<AccountsDB>) {
        result.subscribe((res: AccountsDB) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: AccountsDB) {
        this.eventManager.broadcast({ name: 'accountsDBListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-accounts-db-popup',
    template: ''
})
export class AccountsDBPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private accountsDBPopupService: AccountsDBPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.accountsDBPopupService
                    .open(AccountsDBDialogComponent, params['id']);
            } else {
                this.modalRef = this.accountsDBPopupService
                    .open(AccountsDBDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

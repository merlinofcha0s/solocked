import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { AccountsDB } from './accounts-db.model';
import { AccountsDBService } from './accounts-db.service';

@Injectable()
export class AccountsDBPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private accountsDBService: AccountsDBService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.accountsDBService.find(id)
                    .subscribe((accountsDBResponse: HttpResponse<AccountsDB>) => {
                        const accountsDB: AccountsDB = accountsDBResponse.body;
                        this.ngbModalRef = this.accountsDBModalRef(component, accountsDB);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.accountsDBModalRef(component, new AccountsDB());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    accountsDBModalRef(component: Component, accountsDB: AccountsDB): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.accountsDB = accountsDB;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}

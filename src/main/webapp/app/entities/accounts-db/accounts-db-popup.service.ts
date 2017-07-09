import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccountsDB } from './accounts-db.model';
import { AccountsDBService } from './accounts-db.service';

@Injectable()
export class AccountsDBPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private accountsDBService: AccountsDBService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.accountsDBService.find(id).subscribe((accountsDB) => {
                this.accountsDBModalRef(component, accountsDB);
            });
        } else {
            return this.accountsDBModalRef(component, new AccountsDB());
        }
    }

    accountsDBModalRef(component: Component, accountsDB: AccountsDB): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.accountsDB = accountsDB;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}

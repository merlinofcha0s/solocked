import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {AccountsService} from '../../../shared/account/accounts.service';
import {Router} from '@angular/router';

@Component({
    selector: 'jhi-accountsdb-delete',
    templateUrl: './accountsdb-delete.component.html',
    styles: []
})
export class AccountsdbDeleteComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private accountsService: AccountsService,
                private router: Router) {}

    ngOnInit() {}

    onDelete() {
        this.accountsService.deleteAccount(this.data.id);
        this.router.navigate(['/accounts']);
    }

}

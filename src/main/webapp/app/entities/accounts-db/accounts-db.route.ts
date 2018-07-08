import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountsDB, IAccountsDB } from 'app/shared/model/accounts-db.model';
import { AccountsDBService } from './accounts-db.service';
import { AccountsDBComponent } from './accounts-db.component';
import { AccountsDBDetailComponent } from './accounts-db-detail.component';
import { AccountsDBUpdateComponent } from './accounts-db-update.component';
import { AccountsDBDeletePopupComponent } from './accounts-db-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class AccountsDBResolve implements Resolve<IAccountsDB> {
    constructor(private service: AccountsDBService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((accountsDB: HttpResponse<AccountsDB>) => accountsDB.body));
        }
        return of(new AccountsDB());
    }
}

export const accountsDBRoute: Routes = [
    {
        path: 'accounts-db',
        component: AccountsDBComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'accounts-db/:id/view',
        component: AccountsDBDetailComponent,
        resolve: {
            accountsDB: AccountsDBResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'accounts-db/new',
        component: AccountsDBUpdateComponent,
        resolve: {
            accountsDB: AccountsDBResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'accounts-db/:id/edit',
        component: AccountsDBUpdateComponent,
        resolve: {
            accountsDB: AccountsDBResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const accountsDBPopupRoute: Routes = [
    {
        path: 'accounts-db/:id/delete',
        component: AccountsDBDeletePopupComponent,
        resolve: {
            accountsDB: AccountsDBResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];

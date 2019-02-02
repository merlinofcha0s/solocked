import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AccountsDB } from 'app/shared/model/accounts-db.model';
import { AccountsDBService } from './accounts-db.service';
import { AccountsDBComponent } from './accounts-db.component';
import { AccountsDBDetailComponent } from './accounts-db-detail.component';
import { AccountsDBUpdateComponent } from './accounts-db-update.component';
import { AccountsDBDeletePopupComponent } from './accounts-db-delete-dialog.component';
import { IAccountsDB } from 'app/shared/model/accounts-db.model';

@Injectable({ providedIn: 'root' })
export class AccountsDBResolve implements Resolve<IAccountsDB> {
    constructor(private service: AccountsDBService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAccountsDB> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<AccountsDB>) => response.ok),
                map((accountsDB: HttpResponse<AccountsDB>) => accountsDB.body)
            );
        }
        return of(new AccountsDB());
    }
}

export const accountsDBRoute: Routes = [
    {
        path: '',
        component: AccountsDBComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
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
        path: 'new',
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
        path: ':id/edit',
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
        path: ':id/delete',
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

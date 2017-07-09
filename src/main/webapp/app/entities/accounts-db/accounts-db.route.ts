import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { AccountsDBComponent } from './accounts-db.component';
import { AccountsDBDetailComponent } from './accounts-db-detail.component';
import { AccountsDBPopupComponent } from './accounts-db-dialog.component';
import { AccountsDBDeletePopupComponent } from './accounts-db-delete-dialog.component';

import { Principal } from '../../shared';

export const accountsDBRoute: Routes = [
    {
        path: 'accounts-db',
        component: AccountsDBComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'accounts-db/:id',
        component: AccountsDBDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const accountsDBPopupRoute: Routes = [
    {
        path: 'accounts-db-new',
        component: AccountsDBPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'accounts-db/:id/edit',
        component: AccountsDBPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'accounts-db/:id/delete',
        component: AccountsDBDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];

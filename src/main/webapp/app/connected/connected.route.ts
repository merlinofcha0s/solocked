import { Routes } from '@angular/router';
import { AccountsdbHomeComponent } from 'app/connected/accountsdb-home/accountsdb-home.component';
import { UserRouteAccessService } from 'app/core';
import { AccountsdbAddComponent } from 'app/connected/accountsdb-add/accountsdb-add.component';
import { BillingRouteAccessService } from 'app/shared/auth/billing-route-access.service';
import { BillingComponent } from 'app/connected/billing/billing.component';

export const AccountsHomeRouteName = 'accounts';

export const ACCOUNTSDB_ROUTES: Routes = [
    {
        path: AccountsHomeRouteName,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.title'
        },
        component: AccountsdbHomeComponent,
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'accounts/add',
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.add.header'
        },
        component: AccountsdbAddComponent,
        canActivate: [UserRouteAccessService, BillingRouteAccessService]
    },
    {
        path: 'accounts/edit/:id',
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.update.title'
        },
        component: AccountsdbAddComponent,
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'billing',
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'billing.title'
        },
        component: BillingComponent,
        canActivate: [UserRouteAccessService]
    }
];

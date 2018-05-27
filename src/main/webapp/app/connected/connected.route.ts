import { UserRouteAccessService } from './../shared/auth/user-route-access-service';
import { AccountsdbAddComponent } from './accountsdb-add/accountsdb-add.component';
import { Routes } from '@angular/router';
import { AccountsdbHomeComponent } from './accountsdb-home/accountsdb-home.component';
import {BillingComponent} from './subscription/billing.component';

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
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'accounts/edit/:id',
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.accountsDB.update.header'
        },
        component: AccountsdbAddComponent,
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'subscription',
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'subscription.title'
        },
        component: BillingComponent,
        canActivate: [UserRouteAccessService],
    }
];

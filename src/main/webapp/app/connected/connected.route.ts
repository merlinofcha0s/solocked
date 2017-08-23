import { UserRouteAccessService } from './../shared/auth/user-route-access-service';
import { AccountsdbAddComponent } from './accountsdb-add/accountsdb-add.component';
import { Routes } from '@angular/router';
import { AccountsdbHomeComponent } from './accountsdb-home/accountsdb-home.component';

export const ACCOUNTSDB_ROUTES: Routes = [
    {
        path: 'accounts',
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
            pageTitle: 'ninjaccountApp.accountsDB.add.title'
        },
        component: AccountsdbAddComponent,
        canActivate: [UserRouteAccessService],
    }
];

import {Route} from '@angular/router';

import {UserRouteAccessService} from '../../shared';
import {ImportComponent} from './import.component';
import {BillingRouteAccessService} from "../../shared/auth/billing-route-access.service";

export const importRoute: Route = {
    path: 'import',
    component: ImportComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.menu.account.import'
    },
    canActivate: [UserRouteAccessService, BillingRouteAccessService]
};

import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { BillingRouteAccessService } from 'app/shared/auth/billing-route-access.service';
import { ImportComponent } from 'app/account/import/import.component';

export const importRoute: Route = {
    path: 'import',
    component: ImportComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.menu.account.import'
    },
    canActivate: [UserRouteAccessService, BillingRouteAccessService]
};

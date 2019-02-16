import { Route } from '@angular/router';

import { ActivateComponent } from './activate.component';
import { UserRouteAccessService } from 'app/core';

export const activateRoute: Route = {
    path: 'activate',
    component: ActivateComponent,
    data: {
        authorities: [],
        pageTitle: 'activate.titleHeader'
    },
    canActivate: [UserRouteAccessService]
};

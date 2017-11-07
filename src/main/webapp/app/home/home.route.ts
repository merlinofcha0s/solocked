import { Route } from '@angular/router';

import { HomeComponent } from './';
import {UserRouteAccessIsConnectedService} from '../shared/auth/user-route-is-connected';

export const HOME_ROUTE: Route = {
    path: '',
    component: HomeComponent,
    data: {
        authorities: [],
        pageTitle: 'home.title'
    },
    canActivate: [UserRouteAccessIsConnectedService]
};

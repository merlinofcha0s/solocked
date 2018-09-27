import { Route, Routes } from '@angular/router';

import { HomeComponent } from './';
import { UserRouteAccessIsConnectedService } from '../shared/auth/user-route-is-connected';
import { CguComponent } from 'app/home/cgu/cgu.component';

export const HOME_ROUTE: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            authorities: [],
            pageTitle: 'home.title'
        },
        canActivate: [UserRouteAccessIsConnectedService]
    },
    {
        path: 'cgu',
        component: CguComponent,
        data: {
            authorities: [],
            pageTitle: 'cgu.title'
        }
    }
];

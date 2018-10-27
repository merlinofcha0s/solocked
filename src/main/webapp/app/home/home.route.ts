import { Route, Routes } from '@angular/router';

import { HomeComponent } from './';
import { UserRouteAccessIsConnectedService } from '../shared/auth/user-route-is-connected';
import { CguComponent } from 'app/home/cgu/cgu.component';
import { CookieMgtComponent } from 'app/layouts/main/cookie-mgt/cookie-mgt.component';

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
    },
    {
        path: 'cookies',
        component: CookieMgtComponent,
        data: {
            authorities: [],
            pageTitle: 'cgu.title'
        }
    }
];

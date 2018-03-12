import {Route} from '@angular/router';

import {UserRouteAccessService} from '../../shared';
import {ImportComponent} from "./import.component";

export const importRoute: Route = {
    path: 'import',
    component: ImportComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.menu.account.import'
    },
    canActivate: [UserRouteAccessService]
};

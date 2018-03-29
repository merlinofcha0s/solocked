import {Routes} from '@angular/router';

import {activateRoute, passwordRoute, registerRoute, settingsRoute} from './';
import {importRoute} from './import/import.route';

const ACCOUNT_ROUTES = [
    activateRoute,
    passwordRoute,
    // passwordResetFinishRoute,
    // passwordResetInitRoute,
    registerRoute,
    // socialAuthRoute,
    // socialRegisterRoute,
    settingsRoute,
    importRoute
];

export const accountState: Routes = [{
    path: '',
    children: ACCOUNT_ROUTES
}];

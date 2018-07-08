import { Routes } from '@angular/router';
import { activateRoute } from 'app/account/activate/activate.route';
import { passwordRoute } from 'app/account/password/password.route';
import { importRoute } from 'app/account/import/import.route';
import { settingsRoute } from 'app/account/settings/settings.route';
import { registerRoute } from 'app/account/register/register.route';

const ACCOUNT_ROUTES = [
    activateRoute,
    passwordRoute,
    // passwordResetFinishRoute,
    // passwordResetInitRoute,
    registerRoute,
    settingsRoute,
    importRoute
];

export const accountState: Routes = [
    {
        path: '',
        children: ACCOUNT_ROUTES
    }
];

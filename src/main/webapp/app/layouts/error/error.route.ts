import { Routes } from '@angular/router';

import { ErrorComponent } from './error.component';

export const errorRoute: Routes = [
    {
        path: 'error',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: 'error.title'
        }
    },
    {
        path: 'accessdenied',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: 'error.title',
            error403: true,
            actionLabel: 'error.payment.signup.actionlabel',
            action: '/'
        }
    },
    {
        path: 'paymenterrorsignup',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: 'error.payment.title',
            errorMessage: 'error.payment.content',
            okMessage: 'error.payment.okMessage',
            actionLabel: 'error.payment.signup.actionlabel',
            action: '/'
        }
    },
    {
        path: 'paymenterrorbilling',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: 'error.payment.title',
            errorMessage: 'error.payment.content',
            actionLabel: 'error.payment.billing.actionlabel',
            action: '/accounts'
        }
    }
];

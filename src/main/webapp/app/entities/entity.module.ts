import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { NinjaccountAccountsDBModule } from './accounts-db/accounts-db.module';
import { NinjaccountPaymentModule } from './payment/payment.module';

import { NinjaccountSrpModule } from './srp/srp.module';

/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'accounts-db',
                loadChildren: './accounts-db/accounts-db.module#NinjaccountAccountsDBModule'
            },
            {
                path: 'payment',
                loadChildren: './payment/payment.module#NinjaccountPaymentModule'
            },
            {
                path: 'srp',
                loadChildren: './srp/srp.module#NinjaccountSrpModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountEntityModule {}

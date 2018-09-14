import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { NinjaccountAccountsDBModule } from './accounts-db/accounts-db.module';
import { NinjaccountPaymentModule } from './payment/payment.module';

import { NinjaccountSrpModule } from './srp/srp.module';

/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        NinjaccountAccountsDBModule,
        NinjaccountPaymentModule,
        NinjaccountSrpModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountEntityModule {}

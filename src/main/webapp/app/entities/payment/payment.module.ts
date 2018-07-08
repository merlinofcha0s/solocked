import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from 'app/shared';
import { NinjaccountAdminModule } from 'app/admin/admin.module';
import {
    PaymentComponent,
    PaymentDeleteDialogComponent,
    PaymentDeletePopupComponent,
    PaymentDetailComponent,
    paymentPopupRoute,
    paymentRoute,
    PaymentUpdateComponent
} from './';

const ENTITY_STATES = [...paymentRoute, ...paymentPopupRoute];

@NgModule({
    imports: [NinjaccountSharedModule, NinjaccountAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PaymentComponent,
        PaymentDetailComponent,
        PaymentUpdateComponent,
        PaymentDeleteDialogComponent,
        PaymentDeletePopupComponent
    ],
    entryComponents: [PaymentComponent, PaymentUpdateComponent, PaymentDeleteDialogComponent, PaymentDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountPaymentModule {}

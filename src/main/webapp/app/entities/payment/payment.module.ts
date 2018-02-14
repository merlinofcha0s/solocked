import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {NinjaccountSharedModule} from '../../shared';
import {NinjaccountAdminModule} from '../../admin/admin.module';
import {
    PaymentComponent,
    PaymentDeleteDialogComponent,
    PaymentDeletePopupComponent,
    PaymentDetailComponent,
    PaymentDialogComponent,
    PaymentPopupComponent,
    paymentPopupRoute,
    PaymentPopupService,
    paymentRoute,
    PaymentService,
} from './';

const ENTITY_STATES = [
    ...paymentRoute,
    ...paymentPopupRoute,
];

@NgModule({
    imports: [
        NinjaccountSharedModule,
        NinjaccountAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PaymentComponent,
        PaymentDetailComponent,
        PaymentDialogComponent,
        PaymentDeleteDialogComponent,
        PaymentPopupComponent,
        PaymentDeletePopupComponent,
    ],
    entryComponents: [
        PaymentComponent,
        PaymentDialogComponent,
        PaymentPopupComponent,
        PaymentDeleteDialogComponent,
        PaymentDeletePopupComponent,
    ],
    providers: [
        PaymentService,
        PaymentPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountPaymentModule {}

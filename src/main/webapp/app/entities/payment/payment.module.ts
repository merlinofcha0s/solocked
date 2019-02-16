import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { NinjaccountSharedModule } from 'app/shared';
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
    imports: [NinjaccountSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PaymentComponent,
        PaymentDetailComponent,
        PaymentUpdateComponent,
        PaymentDeleteDialogComponent,
        PaymentDeletePopupComponent
    ],
    entryComponents: [PaymentComponent, PaymentUpdateComponent, PaymentDeleteDialogComponent, PaymentDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountPaymentModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}

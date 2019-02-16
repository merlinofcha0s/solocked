import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { NinjaccountSharedModule } from 'app/shared';
import {
    SrpComponent,
    SrpDeleteDialogComponent,
    SrpDeletePopupComponent,
    SrpDetailComponent,
    srpPopupRoute,
    srpRoute,
    SrpUpdateComponent
} from './';

const ENTITY_STATES = [...srpRoute, ...srpPopupRoute];

@NgModule({
    imports: [NinjaccountSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [SrpComponent, SrpDetailComponent, SrpUpdateComponent, SrpDeleteDialogComponent, SrpDeletePopupComponent],
    entryComponents: [SrpComponent, SrpUpdateComponent, SrpDeleteDialogComponent, SrpDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountSrpModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}

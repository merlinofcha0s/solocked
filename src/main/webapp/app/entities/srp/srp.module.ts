import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { NinjaccountSharedModule } from 'app/shared';
import {
    SrpComponent,
    SrpDetailComponent,
    SrpUpdateComponent,
    SrpDeletePopupComponent,
    SrpDeleteDialogComponent,
    srpRoute,
    srpPopupRoute
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

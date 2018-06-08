import {LOCALE_ID, NgModule} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {registerLocaleData} from '@angular/common';
import locale from '@angular/common/locales/en';

import {
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiLanguageHelper,
    NinjaccountSharedLibsModule
} from './';
import {ChoosePlanComponent} from '../account/register/choose-plan/choose-plan.component';

@NgModule({
    imports: [
        NinjaccountSharedLibsModule
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        ChoosePlanComponent
    ],
    providers: [
        JhiLanguageHelper,
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
    ],
    exports: [
        NinjaccountSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        ChoosePlanComponent
    ]
})
export class NinjaccountSharedCommonModule {
    constructor() {
        registerLocaleData(locale);
    }
}

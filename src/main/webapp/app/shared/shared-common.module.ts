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

@NgModule({
    imports: [
        NinjaccountSharedLibsModule
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent
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
        JhiAlertErrorComponent
    ]
})
export class NinjaccountSharedCommonModule {
    constructor() {
        registerLocaleData(locale);
    }
}

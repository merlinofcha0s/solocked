import { AccountsTechService } from './account/accounts-tech.service';
import { CryptoUtilsService } from './crypto/crypto-utils.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AccountsService } from './account/accounts.service';

import {
    NinjaccountSharedLibsModule,
    NinjaccountSharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    Principal,
    HasAnyAuthorityDirective,
    JhiSocialComponent,
    SocialService,
    JhiLoginModalComponent
} from './';
import { CryptoService } from './crypto/crypto.service';
import {MdButtonModule, MdCheckboxModule, MdFormFieldModule, MdInputModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        NinjaccountSharedLibsModule,
        NinjaccountSharedCommonModule,
        BrowserAnimationsModule,
        MdButtonModule,
        MdCheckboxModule,
        MdFormFieldModule,
        MdInputModule
    ],
    declarations: [
        JhiSocialComponent,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective
    ],
    providers: [
        LoginService,
        LoginModalService,
        AccountService,
        AccountsTechService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        SocialService,
        UserService,
        DatePipe,
        AccountsService,
        CryptoService,
        CryptoUtilsService
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        NinjaccountSharedCommonModule,
        JhiSocialComponent,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        BrowserAnimationsModule,
        MdButtonModule,
        MdCheckboxModule,
        MdFormFieldModule,
        MdInputModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class NinjaccountSharedModule {}

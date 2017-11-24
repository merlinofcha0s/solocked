import {AccountsTechService} from './account/accounts-tech.service';
import {CryptoUtilsService} from './crypto/crypto-utils.service';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AccountsService} from './account/accounts.service';

import {
    AccountService,
    AuthServerProvider,
    CSRFService,
    LoginService,
    LoginModalService,
    JhiLoginModalComponent,
    Principal,
    HasAnyAuthorityDirective,
    JhiSocialComponent,
    NinjaccountSharedCommonModule,
    NinjaccountSharedLibsModule,
    SocialService,
    StateStorageService,
    UserService
} from './';
import {CryptoService} from './crypto/crypto.service';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTabsModule,
    MatProgressBarModule,
    MatChipsModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule, MatDialogModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserRouteAccessIsConnectedService} from './auth/user-route-is-connected';
import {PasswordMatchValidatorDirective} from './auth/password-match.directive';
import {SnackComponent} from './snack/snack.component';
import {AutolockService} from '../layouts/navbar/autologout/autolock.service';
import {DateValidatorDirective} from './validation/date-validator.directive';

@NgModule({
    imports: [
        NinjaccountSharedLibsModule,
        NinjaccountSharedCommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatTabsModule,
        MatDialogModule,
        MatChipsModule,
        MatSelectModule,
        MatProgressBarModule,
        MatMenuModule,
        MatButtonToggleModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule
    ],
    declarations: [
        JhiSocialComponent,
        JhiLoginModalComponent,
        SnackComponent,
        HasAnyAuthorityDirective,
        PasswordMatchValidatorDirective,
        DateValidatorDirective
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
        CryptoUtilsService,
        UserRouteAccessIsConnectedService,
        AutolockService
    ],
    entryComponents: [JhiLoginModalComponent, SnackComponent],
    exports: [
        NinjaccountSharedCommonModule,
        JhiSocialComponent,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        PasswordMatchValidatorDirective,
        DatePipe,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatTabsModule,
        MatDialogModule,
        MatChipsModule,
        MatSelectModule,
        MatProgressBarModule,
        SnackComponent,
        MatMenuModule,
        SnackComponent,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class NinjaccountSharedModule {
}

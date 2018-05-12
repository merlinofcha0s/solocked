import {CryptoUtilsService} from './crypto/crypto-utils.service';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AccountsService} from './account/accounts.service';

import {
    AccountService,
    AuthServerProvider,
    CSRFService,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent,
    JhiSocialComponent,
    LoginModalService,
    LoginService,
    NinjaccountSharedCommonModule,
    NinjaccountSharedLibsModule,
    Principal,
    SocialService,
    StateStorageService,
    UserService
} from './';
import {CryptoService} from './crypto/crypto.service';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatRadioModule, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher
} from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserRouteAccessIsConnectedService} from './auth/user-route-is-connected';
import {PasswordMatchValidatorDirective} from './auth/password-match.directive';
import {SnackComponent} from './snack/snack.component';
import {AutolockService} from '../layouts/navbar/autologout/autolock.service';
import {DateValidatorDirective} from './validation/date-validator.directive';
import {AccountsTechService} from './account/accounts-tech.service';
import {SnackUtilService} from './snack/snack-util.service';
import {SearchService} from './search/search.service';
import {AutofocusDirective} from './validation/autofocus.directive';

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
        MatGridListModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatRadioModule
    ],
    declarations: [
        JhiSocialComponent,
        JhiLoginModalComponent,
        SnackComponent,
        HasAnyAuthorityDirective,
        PasswordMatchValidatorDirective,
        DateValidatorDirective,
        AutofocusDirective
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
        AutolockService,
        SnackUtilService,
        // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
        SearchService,
        {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
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
        MatGridListModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatRadioModule,
        AutofocusDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class NinjaccountSharedModule {
}

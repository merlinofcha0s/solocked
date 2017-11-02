import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from '../shared';

import {
    Register,
    ActivateService,
    PasswordService,
    PasswordResetInitService,
    PasswordResetFinishService,
    PasswordStrengthBarComponent,
    RegisterComponent,
    ActivateComponent,
    PasswordComponent,
    PasswordResetInitComponent,
    PasswordResetFinishComponent,
    SettingsComponent,
    SocialRegisterComponent,
    SocialAuthComponent,
    accountState
} from './';
import {ExportAllAccountsComponent} from './settings/export-all-accounts/export-all-accounts.component';
import {DeleteAllAccountsComponent} from "./settings/delete-all-accounts/delete-all-accounts.component";

@NgModule({
    imports: [
        NinjaccountSharedModule,
        RouterModule.forRoot(accountState, { useHash: true })
    ],
    declarations: [
        SocialRegisterComponent,
        SocialAuthComponent,
        ActivateComponent,
        RegisterComponent,
        PasswordComponent,
        PasswordStrengthBarComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SettingsComponent,
        ExportAllAccountsComponent,
        DeleteAllAccountsComponent
    ],
    providers: [
        Register,
        ActivateService,
        PasswordService,
        PasswordResetInitService,
        PasswordResetFinishService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [ExportAllAccountsComponent, DeleteAllAccountsComponent]
})
export class NinjaccountAccountModule {}

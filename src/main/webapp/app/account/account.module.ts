import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {NinjaccountSharedModule} from '../shared';

import {
    accountState,
    ActivateComponent,
    ActivateService,
    PasswordComponent,
    PasswordResetFinishComponent,
    PasswordResetFinishService,
    PasswordResetInitComponent,
    PasswordResetInitService,
    PasswordService,
    PasswordStrengthBarComponent,
    Register,
    RegisterComponent,
    SettingsComponent,
    SocialAuthComponent,
    SocialRegisterComponent
} from './';
import {ExportAllAccountsComponent} from './settings/export-all-accounts/export-all-accounts.component';
import {DeleteAllAccountsComponent} from './settings/delete-all-accounts/delete-all-accounts.component';
import {ImportComponent} from './import/import.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports: [
        NinjaccountSharedModule,
        RouterModule.forChild(accountState),
        ReactiveFormsModule
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
        DeleteAllAccountsComponent,
        ImportComponent
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
export class NinjaccountAccountModule {
}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from 'app/shared';
import { accountState } from 'app/account/account.route';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordComponent } from 'app/account/password/password.component';
import { RegisterComponent } from 'app/account/register/register.component';
import { PasswordStrengthBarComponent } from 'app/account/password/password-strength-bar.component';
import { ActivateComponent } from 'app/account/activate/activate.component';
import { PasswordResetInitComponent } from 'app/account/password-reset/init/password-reset-init.component';
import { SettingsComponent } from 'app/account/settings/settings.component';
import { PasswordResetFinishComponent } from 'app/account/password-reset/finish/password-reset-finish.component';
import { ExportAllAccountsComponent } from 'app/account/settings/export-all-accounts/export-all-accounts.component';
import { DeleteAllAccountsComponent } from 'app/account/settings/delete-all-accounts/delete-all-accounts.component';
import { ResetAllAccountsComponent } from 'app/account/settings/reset-all-accounts/reset-all-accounts.component';
import { ActivateService } from 'app/account/activate/activate.service';
import { ImportComponent } from 'app/account/import/import.component';
import { NumberValidator } from 'app/account/register/validator/number.validator';
import { UpperValidator } from 'app/account/register/validator/upper.validator';
import { Register } from 'app/account/register/register.service';
import { PasswordResetFinishService } from 'app/account/password-reset/finish/password-reset-finish.service';
import { PasswordResetInitService } from 'app/account/password-reset/init/password-reset-init.service';
import { PasswordService } from 'app/account/password/password.service';

@NgModule({
    imports: [NinjaccountSharedModule, RouterModule.forChild(accountState), ReactiveFormsModule],
    declarations: [
        ActivateComponent,
        RegisterComponent,
        PasswordComponent,
        PasswordStrengthBarComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SettingsComponent,
        ExportAllAccountsComponent,
        DeleteAllAccountsComponent,
        ResetAllAccountsComponent,
        ImportComponent,
        NumberValidator,
        UpperValidator
    ],
    providers: [Register, ActivateService, PasswordService, PasswordResetInitService, PasswordResetFinishService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [ExportAllAccountsComponent, DeleteAllAccountsComponent, ResetAllAccountsComponent]
})
export class NinjaccountAccountModule {}

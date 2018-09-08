import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
    ErrorStateMatcher,
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
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    ShowOnDirtyErrorStateMatcher
} from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { PasswordMatchValidatorDirective } from './auth/password-match.directive';
import { SnackComponent } from './snack/snack.component';
import { DateValidatorDirective } from './validation/date-validator.directive';
import { AutofocusDirective } from './validation/autofocus.directive';
import { WaiterComponent } from './waiter/waiter.component';
import { CheckBillingDirective } from './account/check-billing.directive';
import { NinjaccountSharedLibsModule } from 'app/shared/shared-libs.module';
import { NinjaccountSharedCommonModule } from 'app/shared/shared-common.module';
import { JhiLoginModalComponent } from 'app/shared/login/login.component';
import { HasAnyAuthorityDirective } from 'app/shared/auth/has-any-authority.directive';
import { ScrollDirective } from 'app/shared/util/scroll.directive';
import { InfosButtonComponent } from 'app/home/information/infos-button/infos-button.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ChoosePlanComponent } from 'app/account/register/choose-plan/choose-plan.component';

@NgModule({
    imports: [
        NinjaccountSharedLibsModule,
        NinjaccountSharedCommonModule,
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
        MatRadioModule,
        MatListModule,
        MatIconModule,
        ScrollToModule.forRoot()
    ],
    declarations: [
        JhiLoginModalComponent,
        SnackComponent,
        WaiterComponent,
        HasAnyAuthorityDirective,
        PasswordMatchValidatorDirective,
        DateValidatorDirective,
        AutofocusDirective,
        CheckBillingDirective,
        ScrollDirective,
        InfosButtonComponent,
        ChoosePlanComponent
    ],
    providers: [DatePipe, { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
    entryComponents: [JhiLoginModalComponent, SnackComponent, WaiterComponent],
    exports: [
        NinjaccountSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        PasswordMatchValidatorDirective,
        DatePipe,
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
        MatProgressBarModule,
        MatButtonToggleModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatRadioModule,
        AutofocusDirective,
        WaiterComponent,
        CheckBillingDirective,
        MatListModule,
        MatIconModule,
        ScrollDirective,
        InfosButtonComponent,
        ChoosePlanComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountSharedModule {}

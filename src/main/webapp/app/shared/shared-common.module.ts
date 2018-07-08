import { NgModule } from '@angular/core';

import { FindLanguageFromKeyPipe, JhiAlertComponent, JhiAlertErrorComponent, NinjaccountSharedLibsModule } from './';
import { ChoosePlanComponent } from 'app/account/register/choose-plan/choose-plan.component';

@NgModule({
    imports: [NinjaccountSharedLibsModule],
    declarations: [FindLanguageFromKeyPipe, JhiAlertComponent, JhiAlertErrorComponent, ChoosePlanComponent],
    exports: [NinjaccountSharedLibsModule, FindLanguageFromKeyPipe, JhiAlertComponent, JhiAlertErrorComponent, ChoosePlanComponent]
})
export class NinjaccountSharedCommonModule {}

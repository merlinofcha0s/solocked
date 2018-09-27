import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { HomeInformationComponent } from 'app/home/information/home-information.component';
import { CguComponent } from 'app/home/cgu/cgu.component';

@NgModule({
    imports: [NinjaccountSharedModule, RouterModule.forChild(HOME_ROUTE)],
    declarations: [HomeComponent, HomeInformationComponent, CguComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountHomeModule {}

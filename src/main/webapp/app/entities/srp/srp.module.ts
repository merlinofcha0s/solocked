import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from 'app/shared';
import { NinjaccountAdminModule } from 'app/admin/admin.module';
import {
    SrpComponent,
    SrpDeleteDialogComponent,
    SrpDeletePopupComponent,
    SrpDetailComponent,
    srpPopupRoute,
    srpRoute,
    SrpUpdateComponent
} from './';

const ENTITY_STATES = [...srpRoute, ...srpPopupRoute];

@NgModule({
    imports: [NinjaccountSharedModule, NinjaccountAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [SrpComponent, SrpDetailComponent, SrpUpdateComponent, SrpDeleteDialogComponent, SrpDeletePopupComponent],
    entryComponents: [SrpComponent, SrpUpdateComponent, SrpDeleteDialogComponent, SrpDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountSrpModule {}

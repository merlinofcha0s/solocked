import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NinjaccountSharedModule } from 'app/shared';
import { NinjaccountAdminModule } from 'app/admin/admin.module';
import {
    SrpComponent,
    SrpDetailComponent,
    SrpUpdateComponent,
    SrpDeletePopupComponent,
    SrpDeleteDialogComponent,
    srpRoute,
    srpPopupRoute
} from './';

const ENTITY_STATES = [...srpRoute, ...srpPopupRoute];

@NgModule({
    imports: [NinjaccountSharedModule, NinjaccountAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [SrpComponent, SrpDetailComponent, SrpUpdateComponent, SrpDeleteDialogComponent, SrpDeletePopupComponent],
    entryComponents: [SrpComponent, SrpUpdateComponent, SrpDeleteDialogComponent, SrpDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NinjaccountSrpModule {}

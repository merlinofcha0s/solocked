import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { NinjaccountSharedModule, UserRouteAccessService } from './shared';
import { NinjaccountHomeModule } from './home/home.module';
import { NinjaccountAdminModule } from './admin/admin.module';
import { NinjaccountAccountModule } from './account/account.module';
import { NinjaccountEntityModule } from './entities/entity.module';

import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';

// jhipster-needle-angular-add-module-import JHipster will add new module here

import {
    JhiMainComponent,
    LayoutRoutingModule,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ActiveMenuDirective,
    ErrorComponent
} from './layouts';
import { NinjaccountConnectedModule } from './connected/connected.module';
import {NavbarService} from './layouts/navbar/navbar.service';
import {AutolockComponent} from './layouts/navbar/autologout/autolock.component';
import {AutolockService} from './layouts/navbar/autologout/autolock.service';

@NgModule({
    imports: [
        BrowserModule,
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        NinjaccountSharedModule,
        NinjaccountHomeModule,
        NinjaccountAdminModule,
        NinjaccountAccountModule,
        NinjaccountEntityModule,
        NinjaccountConnectedModule
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent,
        AutolockComponent
    ],
    providers: [
        ProfileService,
        NavbarService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ JhiMainComponent ]
})
export class NinjaccountAppModule {}

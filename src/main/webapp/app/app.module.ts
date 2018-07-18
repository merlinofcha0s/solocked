import './vendor.ts';

import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageService, Ng2Webstorage, SessionStorageService } from 'ngx-webstorage';
import { JhiEventManager } from 'ng-jhipster';

import { NinjaccountSharedModule } from 'app/shared';
import { NinjaccountCoreModule } from 'app/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NinjaccountAppRoutingModule } from 'app/app-routing.module';
import { NinjaccountAccountModule } from 'app/account/account.module';
import { NinjaccountEntityModule } from 'app/entities/entity.module';
import { NinjaccountConnectedModule } from 'app/connected';
import { NinjaccountHomeModule } from 'app/home';
import { ActiveMenuDirective, ErrorComponent, FooterComponent, JhiMainComponent, NavbarComponent, PageRibbonComponent } from 'app/layouts';
import { AutolockComponent } from 'app/layouts/navbar/autologout/autolock.component';
import { SearchComponent } from 'app/layouts/navbar/search/search.component';
import { SafeStateComponent } from 'app/layouts/navbar/safe-state/safe-state.component';
import { WarnBrowserComponent } from 'app/layouts/main/warn-browser/warn-browser.component';
import { BreadcrumbComponent } from 'app/layouts/breadcrumb/breadcrumb.component';
import { PaginationConfig } from 'app/blocks/config/uib-pagination.config';
import { AuthInterceptor } from 'app/blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from 'app/blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from 'app/blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from 'app/blocks/interceptor/notification.interceptor';
import { NgxJsonLdModule } from 'ngx-json-ld';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// jhipster-needle-angular-add-module-import JHipster will add new module here

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NinjaccountAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        NinjaccountSharedModule,
        NinjaccountCoreModule,
        NinjaccountHomeModule,
        NinjaccountAccountModule,
        NinjaccountEntityModule,
        NinjaccountConnectedModule,
        NgxJsonLdModule
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent,
        AutolockComponent,
        SearchComponent,
        SafeStateComponent,
        WarnBrowserComponent,
        BreadcrumbComponent
    ],
    providers: [
        PaginationConfig,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [LocalStorageService, SessionStorageService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [Injector]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [JhiEventManager]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [Injector]
        }
    ],
    entryComponents: [WarnBrowserComponent],
    bootstrap: [JhiMainComponent]
})
export class NinjaccountAppModule {}

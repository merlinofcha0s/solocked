import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SrpService } from './srp.service';
import { SrpComponent } from './srp.component';
import { SrpDetailComponent } from './srp-detail.component';
import { SrpUpdateComponent } from './srp-update.component';
import { SrpDeletePopupComponent } from './srp-delete-dialog.component';
import { ISrp, Srp } from 'app/shared/model/srp.model';

@Injectable({ providedIn: 'root' })
export class SrpResolve implements Resolve<ISrp> {
    constructor(private service: SrpService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISrp> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Srp>) => response.ok),
                map((srp: HttpResponse<Srp>) => srp.body)
            );
        }
        return of(new Srp());
    }
}

export const srpRoute: Routes = [
    {
        path: '',
        component: SrpComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.srp.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: SrpDetailComponent,
        resolve: {
            srp: SrpResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.srp.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: SrpUpdateComponent,
        resolve: {
            srp: SrpResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.srp.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: SrpUpdateComponent,
        resolve: {
            srp: SrpResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.srp.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const srpPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: SrpDeletePopupComponent,
        resolve: {
            srp: SrpResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ninjaccountApp.srp.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];

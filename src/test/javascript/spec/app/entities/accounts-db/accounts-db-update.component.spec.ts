/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { NinjaccountTestModule } from '../../../test.module';
import { AccountsDBUpdateComponent } from 'app/entities/accounts-db/accounts-db-update.component';
import { AccountsDBService } from 'app/entities/accounts-db/accounts-db.service';
import { AccountsDB } from 'app/shared/model/accounts-db.model';

describe('Component Tests', () => {
    describe('AccountsDB Management Update Component', () => {
        let comp: AccountsDBUpdateComponent;
        let fixture: ComponentFixture<AccountsDBUpdateComponent>;
        let service: AccountsDBService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [AccountsDBUpdateComponent]
            })
                .overrideTemplate(AccountsDBUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AccountsDBUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AccountsDBService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new AccountsDB(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.accountsDB = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new AccountsDB();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.accountsDB = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});

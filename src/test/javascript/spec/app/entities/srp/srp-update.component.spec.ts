/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { NinjaccountTestModule } from '../../../test.module';
import { SrpUpdateComponent } from 'app/entities/srp/srp-update.component';
import { SrpService } from 'app/entities/srp/srp.service';
import { Srp } from 'app/shared/model/srp.model';

describe('Component Tests', () => {
    describe('Srp Management Update Component', () => {
        let comp: SrpUpdateComponent;
        let fixture: ComponentFixture<SrpUpdateComponent>;
        let service: SrpService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [SrpUpdateComponent]
            })
                .overrideTemplate(SrpUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SrpUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SrpService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Srp(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.srp = entity;
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
                    const entity = new Srp();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.srp = entity;
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

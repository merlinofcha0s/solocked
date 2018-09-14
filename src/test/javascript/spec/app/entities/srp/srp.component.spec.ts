/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { NinjaccountTestModule } from '../../../test.module';
import { SrpComponent } from 'app/entities/srp/srp.component';
import { SrpService } from 'app/entities/srp/srp.service';
import { Srp } from 'app/shared/model/srp.model';

describe('Component Tests', () => {
    describe('Srp Management Component', () => {
        let comp: SrpComponent;
        let fixture: ComponentFixture<SrpComponent>;
        let service: SrpService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [SrpComponent],
                providers: []
            })
                .overrideTemplate(SrpComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SrpComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SrpService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Srp(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.srps[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});

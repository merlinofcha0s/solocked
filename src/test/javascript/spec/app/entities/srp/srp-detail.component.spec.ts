/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NinjaccountTestModule } from '../../../test.module';
import { SrpDetailComponent } from 'app/entities/srp/srp-detail.component';
import { Srp } from 'app/shared/model/srp.model';

describe('Component Tests', () => {
    describe('Srp Management Detail Component', () => {
        let comp: SrpDetailComponent;
        let fixture: ComponentFixture<SrpDetailComponent>;
        const route = ({ data: of({ srp: new Srp(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [SrpDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(SrpDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SrpDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.srp).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});

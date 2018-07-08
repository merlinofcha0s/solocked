/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NinjaccountTestModule } from '../../../test.module';
import { AccountsDBDetailComponent } from 'app/entities/accounts-db/accounts-db-detail.component';
import { AccountsDB } from 'app/shared/model/accounts-db.model';

describe('Component Tests', () => {
    describe('AccountsDB Management Detail Component', () => {
        let comp: AccountsDBDetailComponent;
        let fixture: ComponentFixture<AccountsDBDetailComponent>;
        const route = ({ data: of({ accountsDB: new AccountsDB(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [AccountsDBDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AccountsDBDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AccountsDBDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.accountsDB).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});

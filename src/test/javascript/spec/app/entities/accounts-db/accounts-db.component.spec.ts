/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { NinjaccountTestModule } from '../../../test.module';
import { AccountsDBComponent } from 'app/entities/accounts-db/accounts-db.component';
import { AccountsDBService } from 'app/entities/accounts-db/accounts-db.service';
import { AccountsDB } from 'app/shared/model/accounts-db.model';

describe('Component Tests', () => {
    describe('AccountsDB Management Component', () => {
        let comp: AccountsDBComponent;
        let fixture: ComponentFixture<AccountsDBComponent>;
        let service: AccountsDBService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [AccountsDBComponent],
                providers: []
            })
                .overrideTemplate(AccountsDBComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AccountsDBComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AccountsDBService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new AccountsDB(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.accountsDBS[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});

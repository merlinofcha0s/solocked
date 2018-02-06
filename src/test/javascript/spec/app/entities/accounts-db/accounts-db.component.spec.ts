/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { NinjaccountTestModule } from '../../../test.module';
import { AccountsDBComponent } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db.component';
import { AccountsDBService } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db.service';
import { AccountsDB } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db.model';

describe('Component Tests', () => {

    describe('AccountsDB Management Component', () => {
        let comp: AccountsDBComponent;
        let fixture: ComponentFixture<AccountsDBComponent>;
        let service: AccountsDBService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [AccountsDBComponent],
                providers: [
                    AccountsDBService
                ]
            })
            .overrideTemplate(AccountsDBComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AccountsDBComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AccountsDBService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new AccountsDB(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.accountsDBS[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

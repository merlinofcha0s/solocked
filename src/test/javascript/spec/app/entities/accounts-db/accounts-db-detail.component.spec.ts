/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { NinjaccountTestModule } from '../../../test.module';
import { AccountsDBDetailComponent } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db-detail.component';
import { AccountsDBService } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db.service';
import { AccountsDB } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db.model';

describe('Component Tests', () => {

    describe('AccountsDB Management Detail Component', () => {
        let comp: AccountsDBDetailComponent;
        let fixture: ComponentFixture<AccountsDBDetailComponent>;
        let service: AccountsDBService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [AccountsDBDetailComponent],
                providers: [
                    AccountsDBService
                ]
            })
            .overrideTemplate(AccountsDBDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AccountsDBDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AccountsDBService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new AccountsDB(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.accountsDB).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

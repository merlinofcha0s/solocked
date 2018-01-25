/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { NinjaccountTestModule } from '../../../test.module';
import { AccountsDBDialogComponent } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db-dialog.component';
import { AccountsDBService } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db.service';
import { AccountsDB } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db.model';
import { UserService } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('AccountsDB Management Dialog Component', () => {
        let comp: AccountsDBDialogComponent;
        let fixture: ComponentFixture<AccountsDBDialogComponent>;
        let service: AccountsDBService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [AccountsDBDialogComponent],
                providers: [
                    UserService,
                    AccountsDBService
                ]
            })
            .overrideTemplate(AccountsDBDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AccountsDBDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AccountsDBService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AccountsDB(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.accountsDB = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'accountsDBListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AccountsDB();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.accountsDB = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'accountsDBListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});

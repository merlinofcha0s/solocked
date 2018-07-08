/* tslint:disable max-line-length */
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { NinjaccountTestModule } from '../../../test.module';
import { AccountsDBDeleteDialogComponent } from 'app/entities/accounts-db/accounts-db-delete-dialog.component';
import { AccountsDBService } from 'app/entities/accounts-db/accounts-db.service';

describe('Component Tests', () => {
    describe('AccountsDB Management Delete Component', () => {
        let comp: AccountsDBDeleteDialogComponent;
        let fixture: ComponentFixture<AccountsDBDeleteDialogComponent>;
        let service: AccountsDBService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [AccountsDBDeleteDialogComponent]
            })
                .overrideTemplate(AccountsDBDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AccountsDBDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AccountsDBService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it(
                'Should call delete service on confirmDelete',
                inject(
                    [],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });
});

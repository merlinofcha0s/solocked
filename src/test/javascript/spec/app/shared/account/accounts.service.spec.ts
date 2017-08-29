import { SessionStorageService } from 'ng2-webstorage/dist/services';
import { JhiDataUtils } from 'ng-jhipster';
import { MockActivatedRoute } from './../../../helpers/mock-route.service';
import { NinjaccountTestModule } from './../../../test.module';
import { TestBed, async, tick, fakeAsync, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountsService } from '../../../../../../main/webapp/app/shared/account/accounts.service';
import { AccountsDBService } from '../../../../../../main/webapp/app/entities/accounts-db/accounts-db.service';
import { CryptoUtilsService } from '../../../../../../main/webapp/app/shared/crypto/crypto-utils.service';
import { CryptoService } from '../../../../../../main/webapp/app/shared/crypto/crypto.service';
import { AccountsTechService } from '../../../../../../main/webapp/app/shared/account/accounts-tech.service';

describe('Services Tests', () => {

    describe('Accounts Service', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [],
                providers: [
                    AccountsService,
                    AccountsDBService,
                    CryptoUtilsService,
                    JhiDataUtils,
                    SessionStorageService,
                    CryptoService,
                    AccountsTechService
                ]
            }).compileComponents();
        }));

        it('return encrypted db with random authentication key',
            inject([AccountsService],
                fakeAsync((service: AccountsService) => {
                    const accounts = service.init();
                    const accountsDB = accounts.accounts;

                    expect(accounts.authenticationKey.length).toEqual(22);
                    expect(accountsDB.length).toEqual(1);
                })
            )
        );

    });
});

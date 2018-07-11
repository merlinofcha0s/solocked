import { SessionStorageService } from 'ngx-webstorage/dist/services';
import { JhiDataUtils } from 'ng-jhipster';
import { TestBed, async, fakeAsync, inject } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { NinjaccountTestModule } from '../../../test.module';
import { AccountsService } from 'app/shared/account/accounts.service';
import { AccountsDBService } from 'app/entities/accounts-db';
import { CryptoService } from 'app/shared/crypto/crypto.service';

describe('Services Tests', () => {
    describe('Accounts Service', () => {
        beforeEach(
            async(() => {
                TestBed.configureTestingModule({
                    imports: [NinjaccountTestModule],
                    declarations: [],
                    providers: [
                        AccountsService,
                        AccountsDBService,
                        JhiDataUtils,
                        SessionStorageService,
                        CryptoService,
                        {
                            provide: TranslateService,
                            useValue: null
                        },
                        {
                            provide: MatSnackBar,
                            useValue: null
                        }
                    ]
                }).compileComponents();
            })
        );

        it(
            'return encrypted db with random authentication key',
            inject(
                [AccountsService],
                fakeAsync((service: AccountsService) => {
                    const accounts = service.init();
                    const accountsDB = accounts.accounts;

                    expect(accounts.authenticationKey.length).toEqual(22);
                    expect(accountsDB.length).toEqual(0);
                })
            )
        );
    });
});

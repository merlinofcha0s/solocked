import { JhiAlertService } from 'ng-jhipster';
import { MockActivatedRoute } from './../../../helpers/mock-route.service';
import { NinjaccountTestModule } from './../../../test.module';
import { TestBed, async, tick, fakeAsync, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountsService } from '../../../../../../main/webapp/app/shared/account/accounts.service';
import { CryptoService } from '../../../../../../main/webapp/app/shared/crypto/crypto.service';

/*describe('Services Tests', () => {

    describe('Crypto Service', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [NinjaccountTestModule],
                declarations: [],
                providers: [
                    CryptoService,
                    AccountsService,
                    {
                        provide: JhiAlertService,
                        useValue: null
                    }
                ]
            }).compileComponents();
        }));

        it('creating a cryptokey with a user password',
            inject([CryptoService, AccountsService],
                async((service: CryptoService) => {

                    let key;
                    Observable.fromPromise(service.creatingKey('looooool password'))
                        .subscribe((derivedCryptoKey: CryptoKey) => {
                            key = derivedCryptoKey;
                        });
                    tick(5000);
                    const usagesExpected = ['encrypt', 'decrypt'];
                    expect(key).toBeDefined();
                    expect(key.extractable).toEqual(true);
                    expect(key.usages).toEqual(usagesExpected);

                })
            )
        );*/

        /* it('crypting a DB with a key',
             inject([CryptoService, AccountsService],
                 fakeAsync((service: CryptoService, accountsService: AccountsService) => {
                     const accountsDB = accountsService.init();
                     Observable.fromPromise(service.creatingKey('looooool password'))
                         .flatMap((derivedCryptoKey) => {
                             return Observable.fromPromise(this.crypto.cryptingDB(accountsDB, derivedCryptoKey));
                         }).subscribe((accountDB: ArrayBuffer) => {
                             expect(accountDB).toBeUndefined();
                         });
                     tick();
                 })
             )
         );*/

        /* it('decrypt a DB with a key',
             inject([CryptoService, AccountsService],
                 fakeAsync((service: CryptoService, accountsService: AccountsService) => {
                     const accountsDB = accountsService.init();
                     let key;
                     Observable.fromPromise(service.creatingKey('looooool password'))
                         .flatMap((derivedCryptoKey) => {
                             key = derivedCryptoKey;
                             return Observable.fromPromise(service.cryptingDB(accountsDB, derivedCryptoKey));
                         }).subscribe((accountDB: ArrayBuffer) => {
                             Observable.fromPromise(this.crypto.;
                         });
                     tick();
                 })
             )
         );

    });
});*/

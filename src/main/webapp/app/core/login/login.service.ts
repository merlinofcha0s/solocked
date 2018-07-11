import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { CryptoService } from 'app/shared/crypto/crypto.service';
import { AccountsDB } from 'app/shared/model/accounts-db.model';
import { AuthServerProvider, Principal } from 'app/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
    constructor(
        private languageService: JhiLanguageService,
        private principal: Principal,
        private authServerProvider: AuthServerProvider,
        private http: HttpClient,
        private cryptoService: CryptoService
    ) {}

    prelogin(username, password): Observable<any> {
        let accountDBJSONOut = null;
        let accountDBArrayBufferOut = null;
        let derivedCryptoKeyOut = null;
        return this.http
            .post('api/preauthenticate', username, { observe: 'response' })
            .map((res: HttpResponse<AccountsDB>) => res.body)
            .flatMap((accountDBJSON: AccountsDB) => {
                accountDBJSONOut = accountDBJSON;
                return Observable.of(this.cryptoService.b64toBlob(accountDBJSONOut.database, 'application/octet-stream', 2048));
            })
            .flatMap((accountDBBlob: Blob) => this.cryptoService.blobToArrayBuffer(accountDBBlob))
            .flatMap(accountDBArrayBuffer => {
                accountDBArrayBufferOut = accountDBArrayBuffer;
                return this.cryptoService.creatingKey(password);
            })
            .flatMap((derivedCryptoKey: CryptoKey) => {
                derivedCryptoKeyOut = derivedCryptoKey;
                return this.cryptoService.putCryptoKeyInStorage(derivedCryptoKeyOut);
            })
            .flatMap((success: boolean) =>
                this.cryptoService.decrypt(accountDBJSONOut.initializationVector, derivedCryptoKeyOut, accountDBArrayBufferOut)
            )
            .flatMap((decryptedDB: ArrayBuffer) => Observable.of(this.cryptoService.arrayBufferToAccounts(decryptedDB)));
    }

    login(credentials, callback?) {
        const cb = callback || function() {};

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe(
                data => {
                    this.principal.identity(true).then(account => {
                        // After the login the language will be changed to
                        // the language selected by the user during his registration
                        if (account !== null) {
                            this.languageService.changeLanguage(account.langKey);
                        }
                        resolve(data);
                    });
                    return cb();
                },
                err => {
                    this.logout();
                    reject(err);
                    return cb(err);
                }
            );
        });
    }

    loginWithToken(jwt, rememberMe) {
        return this.authServerProvider.loginWithToken(jwt, rememberMe);
    }

    logout() {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    }
}

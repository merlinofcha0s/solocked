import { CryptoUtilsService } from './../crypto/crypto-utils.service';
import { LocalStorageService } from 'ng2-webstorage';
import { CryptoService } from './../crypto/crypto.service';
import { AccountsDB } from './../../entities/accounts-db/accounts-db.model';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { Principal } from '../auth/principal.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';

@Injectable()
export class LoginService {

    constructor(
        private languageService: JhiLanguageService,
        private principal: Principal,
        private authServerProvider: AuthServerProvider,
        private http: Http,
        private cryptoService: CryptoService,
        private cryptoUtilsService: CryptoUtilsService
    ) { }

    prelogin(username, password): Observable<any> {
        let accountDBJSONOut = null;
        let accountDBArrayBufferOut = null;
        return this.http.post('api/preauthenticate', username)
            .map((res: Response) => res.json())
            .flatMap((accountDBJSON: AccountsDB) => {
                accountDBJSONOut = accountDBJSON;
                return Observable.of(this.cryptoUtilsService.b64toBlob(accountDBJSONOut.database, 'application/octet-stream', 2048));
            })
            .flatMap((accountDBBlob: Blob) => this.cryptoUtilsService.blobToArrayBuffer(accountDBBlob))
            .flatMap((accountDBArrayBuffer) => {
                accountDBArrayBufferOut = accountDBArrayBuffer;
                return this.cryptoService.creatingKey(password)
            })
            .flatMap((derivedCryptoKey: CryptoKey) => {
                this.cryptoService.putCryptoKeyInLocalStorage(derivedCryptoKey);
                return this.cryptoService.decrypt(accountDBJSONOut.initializationVector, derivedCryptoKey, accountDBArrayBufferOut)
            });
    }

    login(credentials, callback?) {
        const cb = callback || function() { };

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe((data) => {
                this.principal.identity(true).then((account) => {
                    // After the login the language will be changed to
                    // the language selected by the user during his registration
                    if (account !== null) {
                        this.languageService.changeLanguage(account.langKey);
                    }
                    resolve(data);
                });
                return cb();
            }, (err) => {
                this.logout();
                reject(err);
                return cb(err);
            });
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

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Principal } from '../auth/principal.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { SaltAndBDTO } from 'app/shared/login/SaltAndBDTO';
import { SrpService } from 'app/entities/srp';
import { CryptoService } from 'app/shared/crypto/crypto.service';
import { AccountsDBService } from 'app/entities/accounts-db';
import { AccountsDB } from 'app/shared/model/accounts-db.model';
import { Accounts } from 'app/shared/account/accounts.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
    constructor(
        private languageService: JhiLanguageService,
        private principal: Principal,
        private authServerProvider: AuthServerProvider,
        private http: HttpClient,
        private srpService: SrpService,
        private cryptoService: CryptoService,
        private accountService: AccountsDBService
    ) {}

    prelogin(username, password): Observable<any> {
        return this.http
            .post('api/preauthenticate', username, { observe: 'response' })
            .map((res: HttpResponse<SaltAndBDTO>) => res.body)
            .flatMap((saltAndB: SaltAndBDTO) => this.srpService.step2(username, password, saltAndB.salt, saltAndB.b))
            .map(result => result.value)
            .flatMap(values => Observable.of(values));
    }

    login(credentials, callback?) {
        const cb = callback || function() {};

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe(
                data => {
                    // Create and store the key
                    Observable.fromPromise(this.cryptoService.creatingKey(credentials.salt, credentials.passwordForDecrypt))
                        .flatMap(cryptoKey => this.cryptoService.putCryptoKeyInStorage(cryptoKey))
                        .flatMap(recKey => this.principal.identity(true))
                        .subscribe(account => {
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

    migrationToSRP(login: string, password: string) {
        // let accountDBOld;
        // let token;
        // let salt;
        // this.accountService.getAccountDBByLogin(login)
        //     .map(accountsDB => accountsDB.body)
        //     .flatMap(accountDB => {
        //         accountDBOld = accountDB;
        //         return Observable.fromPromise(this.cryptoService.creatingKey('', password));
        //     })
        //     .flatMap(cryptoKey => this.cryptoService.putCryptoKeyInStorage(cryptoKey))
        //     .flatMap(() => this.accountService.decryptWithKeyInStorage(accountDBOld))
        //     .map((accounts: Accounts) => {
        //         token = accounts.authenticationKey;
        //         salt = this.cryptoService.getRandomNumber(16);
        //         return Observable.fromPromise(this.srpService.generateVerifier(login, salt, password))
        //     })
        //     .flatMap(verifier => {
        //         //Call genre de register
        //     });
    }
}

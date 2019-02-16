import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { SaltAndBDTO } from 'app/shared/login/SaltAndBDTO';
import { SrpService } from 'app/entities/srp';
import { CryptoService } from 'app/shared/crypto/crypto.service';
import { JhiLanguageService } from 'ng-jhipster';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { flatMap, map } from 'rxjs/operators';
import { AccountService } from 'app/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
    constructor(
        private languageService: JhiLanguageService,
        private authServerProvider: AuthServerProvider,
        private http: HttpClient,
        private srpService: SrpService,
        private cryptoService: CryptoService,
        private accountService: AccountService
    ) {}

    prelogin(username, password): Observable<any> {
        return this.http.post('api/preauthenticate', username, { observe: 'response' }).pipe(
            map((res: HttpResponse<SaltAndBDTO>) => res.body),
            flatMap((saltAndB: SaltAndBDTO) => this.srpService.step2(username, password, saltAndB.salt, saltAndB.b)),
            map(result => result.value),
            flatMap(values => of(values))
        );
    }

    login(credentials, callback?) {
        const cb = callback || function() {};

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe(
                data => {
                    // Create and store the key
                    fromPromise(this.cryptoService.creatingKey('', credentials.passwordForDecrypt))
                        .pipe(
                            flatMap(cryptoKey => this.cryptoService.putCryptoKeyInStorage(cryptoKey)),
                            flatMap(recKey => this.accountService.identity(true))
                        )
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
        this.accountService.authenticate(null);
    }
}

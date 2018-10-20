import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISrp, Srp } from 'app/shared/model/srp.model';
import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { g, k, N } from 'app/shared/crypto/srp.constant';
import { CryptoService } from 'app/shared/crypto/crypto.service';
import { Accounts } from 'app/shared/account/accounts.model';
import { AccountsDBService } from 'app/entities/accounts-db';
import { Principal } from 'app/core';

type EntityResponseType = HttpResponse<ISrp>;
type EntityArrayResponseType = HttpResponse<ISrp[]>;

@Injectable({ providedIn: 'root' })
export class SrpService {
    private resourceUrl = SERVER_API_URL + 'api/srps';

    constructor(
        private http: HttpClient,
        private cryptoService: CryptoService,
        private accountService: AccountsDBService,
        private principal: Principal
    ) {}

    create(srp: ISrp): Observable<EntityResponseType> {
        return this.http.post<ISrp>(this.resourceUrl, srp, { observe: 'response' });
    }

    update(srp: ISrp): Observable<EntityResponseType> {
        return this.http.put<ISrp>(this.resourceUrl, srp, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISrp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISrp[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    migrateSrp(saltAndBVM: any): Observable<HttpResponse<any>> {
        return this.http.post(`${this.resourceUrl}/migrate-srp`, saltAndBVM, { observe: 'response' });
    }

    async generateX(username: string, salt: string, password: string): Promise<string> {
        const hashTmp = await this.cryptoService.generateHash(username.toLowerCase() + ':' + password);
        return await this.cryptoService.generateHash(salt + hashTmp);
    }

    updateForConnectedUser(srp: ISrp): Observable<EntityResponseType> {
        return this.http.put<ISrp>(`${this.resourceUrl}-user`, srp, { observe: 'response' });
    }

    step2(username: string, password: string, salt10: string, B16: string): Observable<any> {
        const N10 = bigInt(N, 10);
        const B10 = bigInt(B16, 16);

        let a10 = bigInt.zero;
        let A16 = '';
        let A10 = bigInt.zero;
        let u10 = bigInt.zero;
        let s10 = bigInt.zero;
        let X10 = bigInt.zero;

        const ZERO = bigInt.zero;

        return Observable.fromPromise(this.generateX(username, salt10, password))
            .map(x => {
                // Compute A (Client public / private value)
                if (B10.mod(N).equals(ZERO)) {
                    throw new Error("SRP6Exception bad server public value 'B10' as B10 == 0 (mod N)");
                }

                X10 = bigInt(x, 16);
                a10 = bigInt(bigInt.randBetween(ZERO, bigInt(N)));

                A10 = bigInt(g).modPow(a10, N);
                A16 = A10.toString(16);
                return '';
                // Computing U
            })
            .flatMap(result => this.cryptoService.generateHash(A16 + B16))
            .map(hash => {
                u10 = bigInt(hash, 16);
                if (ZERO.equals(u10)) {
                    throw new Error("SRP6Exception bad shared public value 'u10' as u10==0");
                }
                return '';
            })
            .map(result => {
                // Compute Client Session key
                const exp = u10.multiply(X10).add(a10);
                const tmp = bigInt(g)
                    .modPow(X10, N10)
                    .multiply(bigInt(k, 16));
                s10 = this.euclideanModPow(B10.subtract(tmp), exp, N10);
                return '';
            })
            .flatMap(value => this.cryptoService.generateHash(A16 + B16 + s10.toString(16)))
            .map(M110 => {
                while (M110.substring(0, 1) === '0') {
                    M110 = M110.substring(1);
                }

                // console.log('js A10:' + A10.toString());
                // console.log('js A16:' + A16);
                // console.log('js B16 :' + B16);
                // console.log('js B:' + B10.toString());
                // console.log('js u10:' + u10.toString());
                // console.log('js S :' + s10.toString());
                // console.log('js S (HEX):' + s10.toString(16));
                // console.log('js X10:' + X10.toString(16));
                // console.log('js M1:' + M110);

                return Observable.of({ a: A16, M1: M110, salt: salt10 });
            });
    }

    euclideanModPow(a: BigInteger, b: BigInteger, mod: BigInteger) {
        const x = bigInt(a).modPow(b, mod);
        return x.isNegative() ? x.add(mod) : x;
    }

    async generateVerifier(username: string, salt: string, password: string): Promise<string> {
        const hashHex = await this.generateX(username, salt, password);

        const hash = bigInt(hashHex, 16);

        const v = bigInt(g, 10).modPow(hash, N);

        return v.toString(16);
    }

    migrationToSRP(login: string, password: string): Observable<any> {
        let accountDBOld;
        let token;
        let salt;
        return this.accountService
            .getAccountDBByLogin(login)
            .map(accountsDB => accountsDB.body)
            .flatMap(accountDB => {
                accountDBOld = accountDB;
                return Observable.fromPromise(this.cryptoService.creatingKey('', password));
            })
            .flatMap(cryptoKey => this.cryptoService.putCryptoKeyInStorage(cryptoKey))
            .flatMap(() => this.accountService.decryptWithKeyInStorage(accountDBOld))
            .flatMap((accounts: Accounts) => {
                token = accounts.authenticationKey;
                salt = this.cryptoService.getRandomNumber(16);
                return Observable.fromPromise(this.generateVerifier(login, salt, password));
            })
            .flatMap(verifier => {
                const saltAndBVM = { b: verifier, salt, token, login };
                return this.migrateSrp(saltAndBVM);
            });
    }

    public updateSRP(newSalt: string, newPassword) {
        return Observable.fromPromise(this.principal.identity())
            .flatMap(userIdentity => this.generateVerifier(userIdentity.login, newSalt, newPassword))
            .flatMap(verifier => {
                const srp = new Srp(null, newSalt, verifier, null, null);
                return this.updateForConnectedUser(srp);
            });
    }
}

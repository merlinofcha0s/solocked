import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AccountsTechService} from '../../shared/account/accounts-tech.service';
import {Accounts} from '../../shared/account/accounts.model';
import {CryptoService} from '../../shared/crypto/crypto.service';
import {CryptoUtilsService} from '../../shared/crypto/crypto-utils.service';
import {OperationAccountType} from '../../shared/account/operation-account-type.enum';
import {Principal} from '../../shared';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PasswordService {

    constructor(private accountTech: AccountsTechService,
                private crypto: CryptoService,
                private cryptoUtils: CryptoUtilsService,
                private http: HttpClient,
                private principal: Principal) {
    }

    save(newPassword: string): Observable<any> {
        let accountsSynchro = null;
        if (this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
            return this.http.post('api/account/change_password', newPassword);
        } else {
            return this.accountTech.synchroDB()
                .flatMap((accounts: Accounts) => {
                    accountsSynchro = accounts;
                    accountsSynchro.operationAccountType = OperationAccountType.UPDATE;
                    return this.crypto.creatingKey(newPassword);
                }).flatMap((newCryptoKey: CryptoKey) => this.crypto.putCryptoKeyInStorage(newCryptoKey))
                .flatMap((success: boolean) => {
                    const initVector = this.cryptoUtils.getRandomNumber();
                    return this.accountTech.saveEncryptedDB(accountsSynchro, initVector);
                });
        }
    }
}

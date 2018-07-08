import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { AccountsTechService } from 'app/shared/account/accounts-tech.service';
import { CryptoService } from 'app/shared/crypto/crypto.service';
import { CryptoUtilsService } from 'app/shared/crypto/crypto-utils.service';
import { Principal } from 'app/core';
import { Accounts } from 'app/shared/account/accounts.model';
import { OperationAccountType } from 'app/shared/account/operation-account-type.enum';

@Injectable({ providedIn: 'root' })
export class PasswordService {
    constructor(
        private accountTech: AccountsTechService,
        private crypto: CryptoService,
        private cryptoUtils: CryptoUtilsService,
        private http: HttpClient,
        private principal: Principal
    ) {}

    save(newPassword: string): Observable<any> {
        let accountsSynchro = null;
        if (this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
            return this.http.post('api/account/change-password', newPassword);
        } else {
            return this.accountTech
                .synchroDB()
                .flatMap((accounts: Accounts) => {
                    accountsSynchro = accounts;
                    accountsSynchro.operationAccountType = OperationAccountType.UPDATE;
                    return this.crypto.creatingKey(newPassword);
                })
                .flatMap((newCryptoKey: CryptoKey) => this.crypto.putCryptoKeyInStorage(newCryptoKey))
                .flatMap((success: boolean) => {
                    const initVector = this.cryptoUtils.getRandomNumber();
                    return this.accountTech.saveEncryptedDB(accountsSynchro, initVector);
                });
        }
    }
}

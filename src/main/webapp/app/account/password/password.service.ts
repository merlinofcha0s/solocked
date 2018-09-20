import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { CryptoService } from 'app/shared/crypto/crypto.service';
import { Principal } from 'app/core';
import { Accounts } from 'app/shared/account/accounts.model';
import { OperationAccountType } from 'app/shared/account/operation-account-type.enum';
import { AccountsDBService } from 'app/entities/accounts-db/accounts-db.service';
import { SrpService } from 'app/entities/srp';
import { Srp } from 'app/shared/model/srp.model';

@Injectable({ providedIn: 'root' })
export class PasswordService {
    constructor(
        private accountsService: AccountsDBService,
        private crypto: CryptoService,
        private http: HttpClient,
        private principal: Principal,
        private srpService: SrpService
    ) {}

    save(newPassword: string): Observable<any> {
        const accountsSynchro = null;
        const newSalt = this.crypto.getRandomNumber(16);

        if (this.principal.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
            return this.updateSRP(newSalt, newPassword);
        } else {
            return this.updateSRP(newSalt, newPassword).flatMap(srp => this.updatePasswordDB(accountsSynchro, newPassword, newSalt));
        }
    }

    private updateSRP(newSalt: string, newPassword) {
        return Observable.fromPromise(this.principal.identity())
            .flatMap(userIdentity => this.srpService.generateVerifier(userIdentity.login, newSalt, newPassword))
            .flatMap(verifier => {
                const srp = new Srp(null, newSalt, verifier, null, null);
                return this.srpService.updateForConnectedUser(srp);
            });
    }

    private updatePasswordDB(accountsSynchro: Accounts, newPassword: string, salt: string) {
        return this.accountsService
            .synchroDB()
            .flatMap((accounts: Accounts) => {
                accountsSynchro = accounts;
                accountsSynchro.operationAccountType = OperationAccountType.UPDATE;
                return this.crypto.creatingKey(salt, newPassword);
            })
            .flatMap((newCryptoKey: CryptoKey) => this.crypto.putCryptoKeyInStorage(newCryptoKey))
            .flatMap((success: boolean) => {
                const initVector = this.crypto.getRandomNumber(10);
                return this.accountsService.saveEncryptedDB(accountsSynchro, initVector);
            });
    }
}

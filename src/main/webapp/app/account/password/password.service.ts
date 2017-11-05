import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {AccountsTechService} from '../../shared/account/accounts-tech.service';
import {Accounts} from '../../shared/account/accounts.model';
import {CryptoService} from '../../shared/crypto/crypto.service';
import {CryptoUtilsService} from '../../shared/crypto/crypto-utils.service';
import {OperationAccountType} from '../../shared/account/operation-account-type.enum';

@Injectable()
export class PasswordService {

    constructor(private accountTech: AccountsTechService,
                private crypto: CryptoService,
                private cryptoUtils: CryptoUtilsService) {
    }

    save(newPassword: string): Observable<any> {
        let accountsSynchro = null;

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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { CryptoService } from 'app/shared/crypto/crypto.service';
import { Principal } from 'app/core';
import { AccountsDBService } from 'app/entities/accounts-db/accounts-db.service';
import { SrpService } from 'app/entities/srp';

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
            return this.srpService.updateSRP(newSalt, newPassword);
        } else {
            return this.srpService
                .updateSRP(newSalt, newPassword)
                .flatMap(srp => this.accountsService.updatePasswordDB(accountsSynchro, newPassword, newSalt));
        }
    }
}

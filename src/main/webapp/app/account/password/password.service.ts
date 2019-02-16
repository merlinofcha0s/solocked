import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CryptoService } from 'app/shared/crypto/crypto.service';
import { AccountsDBService } from 'app/entities/accounts-db/accounts-db.service';
import { SrpService } from 'app/entities/srp';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AccountService } from 'app/core';

@Injectable({ providedIn: 'root' })
export class PasswordService {
    constructor(
        private accountsService: AccountsDBService,
        private accountService: AccountService,
        private crypto: CryptoService,
        private http: HttpClient,
        private srpService: SrpService
    ) {}

    save(newPassword: string): Observable<any> {
        const accountsSynchro = null;
        const newSalt = this.crypto.getRandomNumber(16);

        if (this.accountService.hasAnyAuthority(['ROLE_ADMIN'])) {
            return this.srpService.updateSRP(newSalt, newPassword);
        } else {
            return this.srpService
                .updateSRP(newSalt, newPassword)
                .pipe(flatMap(srp => this.accountsService.updatePasswordDB(accountsSynchro, newPassword, newSalt)));
        }
    }
}

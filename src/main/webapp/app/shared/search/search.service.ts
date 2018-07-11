import { Injectable } from '@angular/core';
import { Account } from '../account/account.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
    constructor() {}

    filter(term: any, accountsToFilter: Account[]): Account[] {
        if (term.length >= 2) {
            return accountsToFilter.filter(account => {
                const joined = account.tags.join(' ') + account.name;
                return joined.toLowerCase().indexOf(term.toLowerCase()) !== -1;
            });
        }
        return [];
    }
}

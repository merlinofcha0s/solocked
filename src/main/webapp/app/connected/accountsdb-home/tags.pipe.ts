import { Account } from './../../shared/account/account.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tagsFilter' })
export class TagsPipe implements PipeTransform {
    transform(input: Array<Account>, filter: string, field: string): any {
        return input.filter((account: Account) => {
            if (filter === undefined) {
                return account;
            } else {
                const joined = account.tags.join(' ');
                return joined.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
            }
        });
    }
}

import {Component, Input, OnInit, Output} from '@angular/core';
import {Account} from '../../../shared/account/account.model';

@Component({
    selector: 'jhi-accountsdb-list',
    templateUrl: './accountsdb-list.component.html',
    styleUrls: ['./accountsdb-list.component.scss']
})
export class AccountsdbListComponent implements OnInit {

    @Input() account: Account;
    // @Output() banRecipe: EventEmitter<RecipeDTO> = new EventEmitter<RecipeDTO>();

    constructor() {
    }

    ngOnInit() {
    }

}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {LAST_SEARCH} from '../../../shared';
import {SessionStorageService} from 'ngx-webstorage';
import {isUndefined} from 'util';

@Component({
    selector: 'jhi-accountsdb-search',
    templateUrl: './accountsdb-search.component.html',
    styleUrls: ['./accountsdb-search.component.scss']
})
export class AccountsdbSearchComponent implements OnInit {

    @Output() filterTerms = new EventEmitter<string>();

    searchForm: FormGroup;
    searchControl: FormControl;

    constructor(private fb: FormBuilder,
                private sessionStorage: SessionStorageService) {
    }

    ngOnInit() {
        this.initForm();
        this.retrieveLastSearch();
    }

    initForm() {
        this.searchControl = this.fb.control('');
        this.searchForm = this.fb.group({
            searchControl: this.searchControl,
        });

        this.searchControl.valueChanges.subscribe((value) => {
            this.filterTerms.emit(value);
        });
    }

    retrieveLastSearch() {
        const lastSearch = this.sessionStorage.retrieve(LAST_SEARCH);
        if (!isUndefined(lastSearch)) {
            this.searchControl.setValue(lastSearch, {
                onlySelf: false,
                emitEvent: true,
                emitModelToViewChange: false,
                emitViewToModelChange: false
            });
        }
    }

    clearSearch() {
        this.searchControl.setValue('');
    }

    search() {

    }

}

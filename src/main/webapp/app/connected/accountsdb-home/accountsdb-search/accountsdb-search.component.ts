import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'jhi-accountsdb-search',
    templateUrl: './accountsdb-search.component.html',
    styleUrls: ['./accountsdb-search.component.scss']
})
export class AccountsdbSearchComponent implements OnInit {

    @Output() filterTerms = new EventEmitter<string>();

    searchForm: FormGroup;
    searchControl: FormControl;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.searchControl = this.fb.control('');
        this.searchForm = this.fb.group({
            searchControl: this.searchControl,
        });

        this.searchControl.valueChanges.subscribe((value) => this.filterTerms.emit(value));
    }

    clearSearch() {
        this.searchControl.setValue('');
    }

}

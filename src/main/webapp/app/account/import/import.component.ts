import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'jhi-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

    importForm: FormGroup;
    importType: FormControl;

    constructor(private formBuilder: FormBuilder) {

    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.importType = this.formBuilder.control('');

        this.importForm = this.formBuilder.group({
            importType: this.importType
        });
    }

    onSubmitImport() {
        console.log('calling import')
    }
}

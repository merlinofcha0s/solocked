import {Directive} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";

@Directive({
    selector: '[jhiDateValidator][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: DateValidatorDirective, multi: true}]
})
export class DateValidatorDirective implements Validator {


    constructor() {
    }

    validate(control: AbstractControl): { [key: string]: any } {
        // self value
        const value = control.value;
        const isDate = !/Invalid|NaN/.test(new Date(value).toString());

        if (isDate) {
            return null;
        } else {
            return {
                validateDate: false
            }
        }
    }
}

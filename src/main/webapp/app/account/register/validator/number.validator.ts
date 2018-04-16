import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
    selector: '[jhiNumberValidator][ngModel]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: NumberValidator, multi: true}
    ]
})
export class NumberValidator implements Validator {

    constructor() {
    }

    registerOnValidatorChange(fn: () => void): void {
    }

    validate(control: AbstractControl): {[key: string]: any} {
        const numbers = /[0-9]+/.test(control.value);
        if (!numbers) {
            return {
                hasNoNumber: true
            };
        }
        return null;
    }

}

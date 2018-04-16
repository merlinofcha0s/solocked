import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
    selector: '[jhiUpperValidator][ngModel]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: UpperValidator, multi: true}
    ]
})
export class UpperValidator implements Validator {

    constructor() {
    }

    registerOnValidatorChange(fn: () => void): void {
    }

    validate(control: AbstractControl): {[key: string]: any} {
        const upperLetters = /[A-Z]+/.test(control.value);
        if (!upperLetters) {
            return {
                hasNoUpper: true
            };
        }
        return null;
    }

}

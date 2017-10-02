import {Attribute, Directive, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validators} from '@angular/forms';

@Directive({
    selector: '[jhiPasswordMatch][ngModel]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordMatchValidatorDirective), multi: true}
    ]
})
export class PasswordMatchValidatorDirective implements Validators {

    constructor(@Attribute('jhiPasswordMatch') public passwordMatch: string,
                @Attribute('reverse') public reverse: string) {
    }

    private get isReverse() {
        if (!this.reverse) {
            return false;
        }
        return this.reverse === 'true' ? true : false;
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // self value
        const v = c.value;

        // control vlaue
        const e = c.root.get(this.passwordMatch);

        // value not equal
        if (e && v !== e.value && !this.isReverse) {
            return {
                validatePasswordMatch: false
            }
        }

        // value equal and reverse
        if (e && v === e.value && this.isReverse) {
            delete e.errors['passwordMatch'];
            if (!Object.keys(e.errors).length) {
                e.setErrors(null);
            }
        }

        // value not equal and reverse
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({passwordMatch: false});
        }

        return null;
    }
}

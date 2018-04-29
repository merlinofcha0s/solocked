import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'passwordhide'})
export class PasswordHidePipe implements PipeTransform {
    transform(input: string): any {
        let passwordHided = '';
        for (let i = 0; i < input.length; i++) {
            passwordHided = passwordHided.concat('* ');
        }
        return passwordHided;
    }
}

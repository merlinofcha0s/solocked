import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[jhiAutofocus]'
})
export class AutofocusDirective implements OnInit {

    constructor(private el: ElementRef) {
    }

    ngOnInit(): void {
        this.el.nativeElement.focus();
    }

}

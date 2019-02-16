import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Directive({
    selector: '[jhiClickOutside]'
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
    private listening: boolean;
    private globalClick: Subscription;

    @Output('clickOutside') clickOutside: EventEmitter<Object>;

    constructor(private _elRef: ElementRef) {
        this.listening = false;
        this.clickOutside = new EventEmitter();
    }

    ngOnInit() {
        this.globalClick = fromEvent(document, 'click')
            .pipe(
                delay(1),
                tap(() => {
                    this.listening = true;
                })
            )
            .subscribe((event: MouseEvent) => {
                this.onGlobalClick(event);
            });
    }

    ngOnDestroy() {
        this.globalClick.unsubscribe();
    }

    onGlobalClick(event: MouseEvent) {
        if (event instanceof MouseEvent && this.listening === true) {
            if (this.isDescendant(this._elRef.nativeElement, event.target) === true) {
                this.clickOutside.emit({
                    target: event.target || null,
                    value: false
                });
            } else {
                this.clickOutside.emit({
                    target: event.target || null,
                    value: true
                });
            }
        }
    }

    isDescendant(parent, child) {
        let node = child;
        while (node !== null) {
            if (node === parent) {
                return true;
            } else {
                node = node.parentNode;
            }
        }
        return false;
    }
}

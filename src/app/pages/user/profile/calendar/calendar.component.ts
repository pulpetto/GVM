import {
    Component,
    ElementRef,
    HostListener,
    Inject,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css',
})
export class CalendarComponent {
    isOpen: boolean = false;
    daysNames: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    @ViewChild('dropdown', { read: ElementRef, static: false })
    dropdown!: ElementRef;

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.renderer.removeClass(this.document.body, 'overflow-y-hidden');
            this.dropdown.nativeElement.style.height = '0px';
            this.isOpen = false;
        }
    }

    changeFirstDayToLeft() {
        this.daysNames.push(this.daysNames.shift()!);
    }

    changeFirstDayToRight() {
        this.daysNames.unshift(this.daysNames.pop()!);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateHeight(element: any) {
        element.style.height =
            Array.prototype.reduce.call(
                element.childNodes,
                function (p, c) {
                    return p + (c.offsetHeight || 0);
                },
                0
            ) + 'px';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toggleExpand(element: any) {
        if (!element.style.height || element.style.height == '0px') {
            this.renderer.addClass(this.document.body, 'overflow-y-hidden');
            this.calculateHeight(element);
        } else {
            this.renderer.removeClass(this.document.body, 'overflow-y-hidden');
            element.style.height = '0px';
        }
    }
}

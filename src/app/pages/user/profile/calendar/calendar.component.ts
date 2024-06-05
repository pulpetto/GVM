import {
    Component,
    ElementRef,
    HostListener,
    Inject,
    Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-calendar',
    standalone: true,
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css',
    imports: [CommonModule, RouterModule],
})
export class CalendarComponent {
    isOpen: boolean = false;
    currentActiveMonth: string = 'November';
    currentActiveYear: number = 2022;
    daysNames: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    onMonthChange() {}

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.renderer.removeClass(this.document.body, 'overflow-y-hidden');
            this.isOpen = false;
        }
    }

    changeFirstDayToLeft() {
        this.daysNames.push(this.daysNames.shift()!);
    }

    changeFirstDayToRight() {
        this.daysNames.unshift(this.daysNames.pop()!);
    }

    toggleModalVisibility() {
        this.isOpen = !this.isOpen;

        // prettier-ignore
        this.isOpen
            ? this.renderer.addClass(this.document.body, 'overflow-y-hidden')
            : this.renderer.removeClass(
                this.document.body,
                'overflow-y-hidden'
            );
    }
}

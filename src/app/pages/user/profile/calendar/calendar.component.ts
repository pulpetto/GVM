import { Component } from '@angular/core';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css',
})
export class CalendarComponent {
    isOpen: boolean = false;

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
            this.calculateHeight(element);
        } else {
            element.style.height = '0px';
        }
    }
}

import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    Input,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { TimeFormatterPipe } from '../../pipes/time-formatter.pipe';

@Component({
    selector: 'app-scroll-snap-selector',
    standalone: true,
    imports: [CommonModule, TimeFormatterPipe],
    templateUrl: './scroll-snap-selector.component.html',
    styleUrl: './scroll-snap-selector.component.css',
})
export class ScrollSnapSelectorComponent {
    @Input({ required: true }) list: number[] = [];
    @Input({ required: true }) valueType!: 'time' | 'duration';

    dateStart: {
        minute: number;
        hour: number;
        day: number;
        month: number;
        year: number;
    } = {
        minute: 0,
        hour: 0,
        day: 0,
        month: 0,
        year: 0,
    };

    @ViewChildren('hourDivs') hourDivs!: QueryList<ElementRef>;
    @ViewChild('hourContainer') hoursContainer!: ElementRef;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private scrollTimeout: any;

    onScroll() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
            this.checkIntersectingElements();
        }, 100);
    }

    // more reusable
    checkIntersectingElements(): void {
        const containerRect =
            this.hoursContainer.nativeElement.getBoundingClientRect();

        let maxIntersectionArea = 0;
        let mostIntersectingElement: ElementRef | null = null;

        this.hourDivs.forEach((hourDiv) => {
            const hourRect = hourDiv.nativeElement.getBoundingClientRect();

            if (
                hourRect.bottom < containerRect.top ||
                hourRect.top > containerRect.bottom
            )
                return;

            const intersectionArea = this.calculateIntersectionArea(
                containerRect,
                hourRect
            );

            if (intersectionArea > maxIntersectionArea) {
                maxIntersectionArea = intersectionArea;
                mostIntersectingElement = hourDiv;
            }
        });

        if (mostIntersectingElement) {
            mostIntersectingElement = mostIntersectingElement as ElementRef;

            this.dateStart.hour =
                mostIntersectingElement.nativeElement.innerText;

            console.log(
                `Element with the most intersection: ${mostIntersectingElement.nativeElement.innerText} with area: ${maxIntersectionArea}`
            );
        }
    }

    calculateIntersectionArea(
        containerRect: DOMRect,
        elementRect: DOMRect
    ): number {
        const xOverlap = Math.max(
            0,
            Math.min(containerRect.right, elementRect.right) -
                Math.max(containerRect.left, elementRect.left)
        );
        const yOverlap = Math.max(
            0,
            Math.min(containerRect.bottom, elementRect.bottom) -
                Math.max(containerRect.top, elementRect.top)
        );
        return xOverlap * yOverlap;
    }
}

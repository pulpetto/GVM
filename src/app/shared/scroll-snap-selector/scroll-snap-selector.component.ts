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

    @ViewChild('generalContainer') generalContainer!: ElementRef;
    @ViewChildren('valuesContainers') valuesContainers!: QueryList<ElementRef>;

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

    checkIntersectingElements() {
        const containerRect =
            this.generalContainer.nativeElement.getBoundingClientRect();

        let maxIntersectionArea = 0;
        let mostIntersectingElement: ElementRef | null = null;

        this.valuesContainers.forEach((container) => {
            const rect = container.nativeElement.getBoundingClientRect();

            if (
                rect.bottom < containerRect.top ||
                rect.top > containerRect.bottom
            )
                return;

            const intersectionArea = this.calculateIntersectionArea(
                containerRect,
                rect
            );

            if (intersectionArea > maxIntersectionArea) {
                maxIntersectionArea = intersectionArea;
                mostIntersectingElement = container;
            }
        });

        if (mostIntersectingElement) {
            mostIntersectingElement = mostIntersectingElement as ElementRef;

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

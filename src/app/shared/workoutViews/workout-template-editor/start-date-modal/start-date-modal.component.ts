import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBackdrop = { opacity: '100%' };
const hiddenBackdrop = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-start-date-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './start-date-modal.component.html',
    styleUrl: './start-date-modal.component.css',
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModal)),
            ]),
            transition(':leave', [
                style(visibleModal),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose2', [
            transition(':enter', [
                style(hiddenBackdrop),
                animate(timing, style(visibleBackdrop)),
            ]),
            transition(':leave', [
                style(visibleBackdrop),
                animate(timing, style(hiddenBackdrop)),
            ]),
        ]),
        trigger('openClose3', [
            transition(':enter', [
                style(hiddenBtnFixed),
                animate(timing, style(visibleBtnFixed)),
            ]),
            transition(':leave', [
                style(visibleBtnFixed),
                animate(timing, style(hiddenBtnFixed)),
            ]),
        ]),
    ],
})
export class StartDateModalComponent {
    @Input({ required: true }) visibility: boolean = false;

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

import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScrollSnapSelectorComponent } from '../../../scroll-snap-selector/scroll-snap-selector.component';
import { CalendarDatePickerComponent } from './calendar-date-picker/calendar-date-picker.component';

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
    imports: [
        CommonModule,
        ScrollSnapSelectorComponent,
        CalendarDatePickerComponent,
    ],
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

    @Output() closeEvent = new EventEmitter<void>();

    hours: number[] = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
    ];

    minutes: number[] = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60,
    ];

    close() {
        this.closeEvent.emit();
    }
}

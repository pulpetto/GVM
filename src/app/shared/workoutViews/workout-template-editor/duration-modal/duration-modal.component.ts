import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeFormatterPipe } from '../../../../pipes/time-formatter.pipe';
import { ScrollSnapSelectorComponent } from '../../../scroll-snap-selector/scroll-snap-selector.component';
import { FormControl } from '@angular/forms';

const visibleModal = { top: '66.666667%' };
const hiddenModal = { top: '100%' };

const visibleBackdrop = { opacity: '100%' };
const hiddenBackdrop = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-duration-modal',
    standalone: true,
    imports: [CommonModule, TimeFormatterPipe, ScrollSnapSelectorComponent],
    templateUrl: './duration-modal.component.html',
    styleUrl: './duration-modal.component.css',
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
export class DurationModalComponent {
    @Input({ required: true }) duration!: FormControl;
    @Input({ required: true }) visibility: boolean = false;

    @Output() closeEvent = new EventEmitter<void>();
    @Output() durationChangeEvent = new EventEmitter<number>();

    timeValues: number[] = [
        300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600,
        3900, 4200, 4500, 4800, 5100, 5400, 5700, 6000, 6300, 6600, 6900, 7200,
    ];

    changeDuration(timeValue: number) {
        this.duration.setValue(timeValue);
        this.durationChangeEvent.emit(timeValue);
    }

    close() {
        this.visibility = false;
        this.closeEvent.emit();
    }
}

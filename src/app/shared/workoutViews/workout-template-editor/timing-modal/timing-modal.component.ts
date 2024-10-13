import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeFormatterPipe } from '../../../../pipes/time-formatter.pipe';
import { MonthNamePipe } from '../../../../pipes/month-name.pipe';

const visibleModal = { top: '75%' };
const hiddenModal = { top: '100%' };

const visibleBackdrop = { opacity: '100%' };
const hiddenBackdrop = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-timing-modal',
    standalone: true,
    imports: [CommonModule, TimeFormatterPipe, MonthNamePipe],
    templateUrl: './timing-modal.component.html',
    styleUrl: './timing-modal.component.css',
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
export class TimingModalComponent {
    @Input({ required: true }) visibility: boolean = false;
    @Input({ required: true }) workoutDuration!: number;
    @Input({ required: true }) workoutDateStart!: {
        year: string | null;
        month: string | null;
        day: string | null;
        hour: string | null;
        minute: string | null;
    };

    @Output() openDurationModalEvent = new EventEmitter<void>();
    @Output() openStartDateModalEvent = new EventEmitter<void>();
    @Output() closeEvent = new EventEmitter<void>();

    openDurationModal() {
        this.openDurationModalEvent.emit();
    }

    openStartDateModal() {
        this.openStartDateModalEvent.emit();
    }

    close() {
        this.visibility = false;
        this.closeEvent.emit();
    }
}

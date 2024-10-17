import {
    Component,
    computed,
    Inject,
    Renderer2,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateTime, Info, Interval } from 'luxon';
import { animate, style, transition, trigger } from '@angular/animations';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-calendar',
    standalone: true,
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css',
    imports: [CommonModule, RouterModule],
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
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
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
export class CalendarComponent {
    today: Signal<DateTime> = signal(
        DateTime.local().setZone('America/New_York')
    );
    firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
        this.today().startOf('month')
    );

    activeDay: WritableSignal<DateTime | null> = signal(null);

    weekDays: Signal<string[]> = signal(Info.weekdays('short'));
    daysOfMonth: Signal<DateTime[]> = computed(() => {
        return Interval.fromDateTimes(
            this.firstDayOfActiveMonth().startOf('week'),
            this.firstDayOfActiveMonth().endOf('month').endOf('week')
        )
            .splitBy({ day: 1 })
            .map((d) => {
                if (d.start === null) {
                    throw new Error('Wrong dates');
                }
                return d.start;
            });
    });

    DATE_MED = DateTime.DATE_MED;

    loading: boolean = true;
    goToNextMonth() {
        this.firstDayOfActiveMonth.set(
            this.firstDayOfActiveMonth().plus({ month: 1 })
        );
    }

    goToPreviousMonth() {
        this.firstDayOfActiveMonth.set(
            this.firstDayOfActiveMonth().minus({ month: 1 })
        );
    }

    goToCurrentMonth() {
        this.firstDayOfActiveMonth.set(this.today().startOf('month'));
    }

    // ---------- ---------- ---------- ---------- ----------

    monthChangeModalVisibility: boolean = false;

    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    toggleModalVisibility() {
        this.monthChangeModalVisibility = !this.monthChangeModalVisibility;

        // prettier-ignore
        this.monthChangeModalVisibility
            ? this.renderer.addClass(this.document.body, 'overflow-y-hidden')
            : this.renderer.removeClass(
                this.document.body,
                'overflow-y-hidden'
            );
    }
}

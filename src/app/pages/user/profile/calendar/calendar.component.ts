import {
    Component,
    computed,
    ElementRef,
    HostListener,
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

@Component({
    selector: 'app-calendar',
    standalone: true,
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css',
    imports: [CommonModule, RouterModule],
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

    isOpen: boolean = false;

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

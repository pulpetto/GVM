import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    Input,
    OnInit,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateTime, Info, Interval } from 'luxon';

@Component({
    selector: 'app-calendar-date-picker',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar-date-picker.component.html',
    styleUrl: './calendar-date-picker.component.css',
})
export class CalendarDatePickerComponent implements OnInit {
    @Input({ required: true }) workoutDateStartYear!: FormControl;
    @Input({ required: true }) workoutDateStartMonth!: FormControl;
    @Input({ required: true }) workoutDateStartDay!: FormControl;

    today: Signal<DateTime> = signal(DateTime.local().setZone('system'));
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

    ngOnInit() {
        this.activeDay.set(this.today());
    }

    changeActiveDay(dayOfMonth: DateTime) {
        this.activeDay.set(dayOfMonth);

        this.workoutDateStartYear.setValue(dayOfMonth.year);
        this.workoutDateStartMonth.setValue(dayOfMonth.month);
        this.workoutDateStartDay.setValue(dayOfMonth.day);
    }

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
}

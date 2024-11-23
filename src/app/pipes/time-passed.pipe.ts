import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
    name: 'timePassed',
    standalone: true,
})
export class TimePassedPipe implements PipeTransform {
    transform(value: number): string {
        if (!value) return '';

        const date = DateTime.fromMillis(value);
        const now = DateTime.now();

        const diff = now
            .diff(date, [
                'years',
                'months',
                'weeks',
                'days',
                'hours',
                'minutes',
            ])
            .toObject();

        if (diff.years && diff.years >= 1)
            return `${Math.floor(diff.years)} year${
                diff.years >= 2 ? 's' : ''
            } ago`;
        if (diff.months && diff.months >= 1)
            return `${Math.floor(diff.months)} month${
                diff.months >= 2 ? 's' : ''
            } ago`;
        if (diff.weeks && diff.weeks >= 1)
            return `${Math.floor(diff.weeks)} week${
                diff.weeks >= 2 ? 's' : ''
            } ago`;
        if (diff.days && diff.days >= 1)
            return `${Math.floor(diff.days)} day${
                diff.days >= 2 ? 's' : ''
            } ago`;
        if (diff.hours && diff.hours >= 1)
            return `${Math.floor(diff.hours)} hour${
                diff.hours >= 2 ? 's' : ''
            } ago`;
        if (diff.minutes && diff.minutes >= 1)
            return `${Math.floor(diff.minutes)} minute${
                diff.minutes >= 2 ? 's' : ''
            } ago`;

        return 'just now';
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'monthName',
    standalone: true,
})
export class MonthNamePipe implements PipeTransform {
    private readonly monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    transform(value: number | string): string {
        if (+value >= 1 && +value <= 12) {
            return this.monthNames[+value - 1];
        }
        return 'Invalid Month';
    }
}

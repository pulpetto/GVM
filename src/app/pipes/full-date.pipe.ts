import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
    name: 'fullDate',
    standalone: true,
})
export class FullDatePipe implements PipeTransform {
    transform(value: number): string {
        const date = DateTime.fromSeconds(value);

        return date.toFormat('dd LLLL yyyy - HH:mm');
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeFormatter',
    standalone: true,
})
export class TimeFormatterPipe implements PipeTransform {
    transform(value: number): string {
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = value % 60;

        let formattedTime = '';

        if (hours > 0) {
            formattedTime += `${hours}h `;
        }

        if (minutes > 0 || hours > 0) {
            formattedTime += `${minutes}m `;
        }

        if (seconds > 0) {
            formattedTime += `${seconds}s`;
        }

        if (seconds === 0 && minutes === 0) {
            formattedTime = `${hours}h `;
        }

        formattedTime;

        return formattedTime;
    }
}

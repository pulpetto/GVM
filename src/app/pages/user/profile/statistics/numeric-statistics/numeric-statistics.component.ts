import { Component, Input } from '@angular/core';
import { NumberSeparatorPipe } from '../../../../../pipes/number-separator.pipe';
import { TimeFormatterPipe } from '../../../../../pipes/time-formatter.pipe';

@Component({
    selector: 'app-numeric-statistics',
    standalone: true,
    imports: [NumberSeparatorPipe, TimeFormatterPipe],
    templateUrl: './numeric-statistics.component.html',
    styleUrl: './numeric-statistics.component.css',
})
export class NumericStatisticsComponent {
    @Input({ required: true }) workoutsAmount!: number;
    @Input({ required: true }) setsAmount!: number;
    @Input({ required: true }) repsAmount!: number;
    @Input({ required: true }) timeSpentUnix!: number;
    @Input({ required: true }) volume!: number;
}

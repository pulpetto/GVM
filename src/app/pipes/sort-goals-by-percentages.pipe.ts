import { Pipe, PipeTransform } from '@angular/core';
import { CurrentGoal } from '../interfaces/goals/current-goal';

@Pipe({
    name: 'sortGoalsByPercentages',
    standalone: true,
})
export class SortGoalsByPercentagesPipe implements PipeTransform {
    transform(
        goals: CurrentGoal[],
        orderBy: keyof CurrentGoal = 'percentageProgress',
        ascending: boolean = true
    ): CurrentGoal[] {
        return goals.slice().sort((a, b) => {
            const valueA = a[orderBy];
            const valueB = b[orderBy];

            if (valueA < valueB) return ascending ? -1 : 1;
            if (valueA > valueB) return ascending ? 1 : -1;
            return 0;
        });
    }
}

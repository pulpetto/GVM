import { Component } from '@angular/core';
import { InputComponent } from '../../../../shared/input/input.component';
import { MuscleGroup } from '../../../../interfaces/muscle-group';

@Component({
    selector: 'app-exercises',
    standalone: true,
    templateUrl: './exercises.component.html',
    styleUrl: './exercises.component.css',
    imports: [InputComponent],
})
export class ExercisesComponent {
    muscleGroups: MuscleGroup[] = [
        { name: 'Upper Back', imageUrl: '' },
        { name: 'Lower Back', imageUrl: '' },
        { name: 'Lats', imageUrl: '' },
        { name: 'Chest', imageUrl: '' },
        { name: 'Abs', imageUrl: '' },
        { name: 'Biceps', imageUrl: '' },
        { name: 'Triceps', imageUrl: '' },
        { name: 'Rear Delts', imageUrl: '' },
        { name: 'Side Delts', imageUrl: '' },
        { name: 'Front Delts', imageUrl: '' },
        { name: 'Forearms', imageUrl: '' },
        { name: 'Traps', imageUrl: '' },
        { name: 'Neck', imageUrl: '' },
        { name: 'Quads', imageUrl: '' },
        { name: 'Hamstrings', imageUrl: '' },
        { name: 'Glutes', imageUrl: '' },
        { name: 'Calves', imageUrl: '' },
    ];

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
    muscleGroups = [
        {
            name: 'Upper Back',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Upper-Back.jpg',
            focusOn: 'top',
        },
        {
            name: 'Lower Back',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Lower-Back.jpg',
            focusOn: 'top',
        },
        {
            name: 'Lats',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Lats.jpg',
            focusOn: 'top',
        },
        {
            name: 'Chest',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Chest.jpg',
            focusOn: 'top',
        },
        {
            name: 'Abs',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Abs.jpg',
            focusOn: 'top',
        },
        {
            name: 'Biceps',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Biceps.jpg',
            focusOn: 'top',
        },
        {
            name: 'Triceps',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Triceps.jpg',
            focusOn: 'top',
        },
        {
            name: 'Shoulders',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Shoulders.jpg',
            focusOn: 'top',
        },
        {
            name: 'Forearms',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Forearms.jpg',
            focusOn: 'center',
        },
        {
            name: 'Traps',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Traps.jpg',
            focusOn: 'top',
        },
        {
            name: 'Neck',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Neck.jpg',
            focusOn: 'top',
        },
        {
            name: 'Quads',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Quads.jpg',
            focusOn: 'bottom',
        },
        {
            name: 'Hamstrings',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Hamstrings.jpg',
            focusOn: 'bottom',
        },
        {
            name: 'Glutes',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/Glutes.jpg',
            focusOn: 'bottom',
        },
        {
            name: 'Calves',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/calves_0.jpg',
            focusOn: 'center',
        },
    ];

    onMuscleGroupSelect($index: number) {
        this.muscleGroups[$index].isSelected =
            !this.muscleGroups[$index].isSelected;
    }

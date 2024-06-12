import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Set } from '../../interfaces/set';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';

@Component({
    selector: 'app-exercise-edit-mode',
    standalone: true,
    templateUrl: './exercise-edit-mode.component.html',
    styleUrl: './exercise-edit-mode.component.css',
    imports: [CommonModule, InfoModalButtonComponent],
})
export class ExerciseEditModeComponent {
    optionsModalVisibility: boolean = false;
    setTypeModalVisibility: boolean = false;

    sets: Set[] = [
        { number: 1, type: 'W', weight: 100, reps: 20, rpe: 9 },
        { number: 2, type: 'W', weight: 100, reps: 20, rpe: 9 },
        { number: 3, type: 'W', weight: 100, reps: 20, rpe: 9 },
        { number: 4, type: 'W', weight: 100, reps: 20, rpe: 9 },
    ];

    setTypes = [
        {
            name: 'normal',
            textColor: 'text-white',
            borderColor: 'border-white',
            isSelected: true,
        },
        {
            name: 'warmup',
            textColor: 'text-yellow-500',
            borderColor: 'border-yellow-500',
            isSelected: false,
        },
        {
            name: 'failure',
            textColor: 'text-red-500',
            borderColor: 'border-red-500',
            isSelected: false,
        },
        {
            name: 'paused',
            textColor: 'text-blue-500',
            borderColor: 'border-blue-500',
            isSelected: false,
        },
        {
            name: 'drop',
            textColor: 'text-orange-500',
            borderColor: 'border-orange-500',
            isSelected: false,
        },
        {
            name: 'cluster',
            textColor: 'text-amber-500',
            borderColor: 'border-amber-500',
            isSelected: false,
        },
        {
            name: 'iso',
            textColor: 'text-indigo-500',
            borderColor: 'border-indigo-500',
            isSelected: false,
        },
        {
            name: 'partials',
            textColor: 'text-fuchsia-500',
            borderColor: 'border-fuchsia-500',
            isSelected: false,
        },
        {
            name: 'slow eccentric',
            textColor: 'text-green-500',
            borderColor: 'border-green-500',
            isSelected: false,
        },
    ];

    onSetTypeChange($index: number) {
        this.setTypes.forEach((set) => (set.isSelected = false));
        this.setTypes[$index].isSelected = true;
    }
}

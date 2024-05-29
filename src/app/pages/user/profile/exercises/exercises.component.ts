import {
    Component,
    Inject,
    Renderer2,
} from '@angular/core';
import { InputComponent } from '../../../../shared/input/input.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-exercises',
    standalone: true,
    templateUrl: './exercises.component.html',
    styleUrl: './exercises.component.css',
    imports: [InputComponent, CommonModule, RouterModule],
})
export class ExercisesComponent {
    exercises = [
        {
            name: 'Squat',
            iconRoute: 'assets/exercisesThumbnails/Squat-Thumbnail.jpg',
            muscleGroups: 'Quads, Glutes, Hamstrings',
        },
        {
            name: 'Bench Press',
            iconRoute: 'assets/exercisesThumbnails/frame_00_delay-1s.jpg',
            muscleGroups: 'Chest, Triceps, Shoulders',
        },
    ];

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

    equipment = [
        {
            name: 'Dumbells',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/calves_0.jpg',
        },
        {
            name: 'Barbell',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/calves_0.jpg',
        },
        {
            name: 'Bodyweight',
            isSelected: false,
            imageUrl: 'assets/images/muscleGroups/calves_0.jpg',
        },
    ];

    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    bgBlurVisibility: boolean = false;
    muscleGroupsModalVisibility: boolean = false;
    equipementModalVisibility: boolean = false;

    openModal(whichToOpen: 'equipement' | 'muscleGroups') {
        whichToOpen === 'equipement'
            ? (this.equipementModalVisibility = true)
            : (this.muscleGroupsModalVisibility = true);

        this.bgBlurVisibility = true;
        this.renderer.addClass(this.document.body, 'overflow-y-hidden');
    }

    closeModal() {
        this.equipementModalVisibility = false;
        this.muscleGroupsModalVisibility = false;

        this.bgBlurVisibility = false;
        this.renderer.removeClass(this.document.body, 'overflow-y-hidden');
    }

    onOptionSelect(modalName: 'equipment' | 'muscleGroups', $index: number) {
        this[modalName][$index].isSelected =
            !this[modalName][$index].isSelected;
    }

    get checkedEquipementCount(): number {
        return this.equipment.filter((item) => item.isSelected).length;
    }

    get checkedMuscleGroupsCount(): number {
        return this.muscleGroups.filter((muscleGroup) => muscleGroup.isSelected)
            .length;
    }
}

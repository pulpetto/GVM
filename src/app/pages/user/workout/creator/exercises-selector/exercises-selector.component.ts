import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MuscleGroupsModalComponent } from '../../../../../shared/modals/muscle-groups-modal/muscle-groups-modal.component';

@Component({
    selector: 'app-exercises-selector',
    standalone: true,
    templateUrl: './exercises-selector.component.html',
    styleUrl: './exercises-selector.component.css',
    imports: [CommonModule, FormsModule, MuscleGroupsModalComponent],
})
export class ExercisesSelectorComponent {
    exercises = [
        {
            name: 'Squat',
            iconRoute: 'assets/exercisesThumbnails/Squat-Thumbnail.jpg',
            muscleGroups: 'Quads, Glutes, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Bench Press',
            iconRoute: 'assets/exercisesThumbnails/frame_00_delay-1s.jpg',
            muscleGroups: 'Chest, Triceps, Shoulders',
            isSelected: false,
        },
        {
            name: 'Bicep Curl',
            iconRoute: 'assets/exercisesThumbnails/Bicep-Curl.jpg',
            muscleGroups: 'Biceps',
            isSelected: false,
        },
        {
            name: 'Close Grip Pushup',
            iconRoute: 'assets/exercisesThumbnails/Close-Grip-Pushup.jpg',
            muscleGroups: 'Triceps, Chest, Shoulders',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
            isSelected: false,
        },
    ];

    newlyChosenExercisesCount: number = 0;

    exercisesModalVisibility: boolean = true;

    innerModalsVisibility: boolean = false;

    openExercisesModal() {
        this.exercisesModalVisibility = true;
        this.newlyChosenExercisesCount = 0;
    }

    closeExercisesModal() {
        this.exercisesModalVisibility = false;
        this.exercises.forEach((exercise) => {
            exercise.isSelected = false;
        });
    }

    onExerciseClick($index: number) {
        this.exercises[$index].isSelected = !this.exercises[$index].isSelected;

        if (this.exercises[$index].isSelected === true) {
            this.newlyChosenExercisesCount++;
        } else {
            this.newlyChosenExercisesCount--;
        }
    }

    searchTerm: string = '';
    exercisesDisplayCopy = this.exercises;

    onExerciseSearch() {
        this.exercisesDisplayCopy = this.exercises.filter((exercise) =>
            exercise.name
                .toLowerCase()
                .startsWith(this.searchTerm.toLowerCase())
        );
    }
}

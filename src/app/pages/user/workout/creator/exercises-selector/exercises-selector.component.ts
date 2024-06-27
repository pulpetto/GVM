import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-exercises-selector',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './exercises-selector.component.html',
    styleUrl: './exercises-selector.component.css',
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

    exercisesModalVisibility: boolean = true;
}

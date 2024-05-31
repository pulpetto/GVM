import { Component } from '@angular/core';
import { ChartsCarouselComponent } from '../charts-carousel/charts-carousel.component';
import { TabsComponent } from '../tabs/tabs.component';
import { InstructionComponent } from './instruction/instruction.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-exercise',
    standalone: true,
    templateUrl: './exercise.component.html',
    styleUrl: './exercise.component.css',
    imports: [
        ChartsCarouselComponent,
        TabsComponent,
        InstructionComponent,
        RouterModule,
        CommonModule,
    ],
})
export class ExerciseComponent {
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
        {
            name: 'Bicep Curl',
            iconRoute: 'assets/exercisesThumbnails/Bicep-Curl.jpg',
            muscleGroups: 'Biceps',
        },
        {
            name: 'Close Grip Pushup',
            iconRoute: 'assets/exercisesThumbnails/Close-Grip-Pushup.jpg',
            muscleGroups: 'Triceps, Chest, Shoulders',
        },
        {
            name: 'Sumo Squat',
            iconRoute: 'assets/exercisesThumbnails/Sumo-Squat.jpg',
            muscleGroups: 'Glutes, Quads, Hamstrings',
        },
    ];

    stepsSimplified = [
        {
            stepName: 'Setup',
            subSteps: [
                'Stand with your feet hip-width apart and the bar over your mid-foot.',
                'Bend down and grip the bar just outside your knees.',
                'Keep your back straight and chest up.',
            ],
        },
        {
            stepName: 'Lift',
            subSteps: [
                'Push through your heels and stand up, lifting the bar.',
                'Keep the bar close to your body.',
                'Stand straight with the bar at thigh level.',
            ],
        },
        {
            stepName: 'Lockout',
            subSteps: [
                'Stand tall with your hips and knees fully extended.',
                'Keep your shoulders back.',
            ],
        },
        {
            stepName: 'Descent',
            subSteps: [
                'Push your hips back and bend your knees to lower the bar.',
                'Keep the bar close to your body.',
                'Lower the bar to the ground.',
            ],
        },
        {
            stepName: 'Reset',
            subSteps: [
                'Ensure your setup is correct before lifting again.',
                'Repeat the steps for additional repetitions.',
            ],
        },
    ];

    stepsDetailed = [
        {
            stepName: 'Setup',
            subSteps: [
                'Stand with your feet hip-width apart and the barbell over the middle of your feet.',
                'Bend at the hips and knees to lower yourself down to grip the barbell just outside your knees.',
                'Keep your back straight and your chest up, with your shoulders directly over the bar.',
                'Engage your core and take a deep breath in.',
            ],
        },
        {
            stepName: 'Lift',
            subSteps: [
                'Begin the lift by driving through your heels and extending your knees and hips simultaneously.',
                'Keep the barbell close to your body as you lift, ensuring it stays over the middle of your feet.',
                'Maintain a straight back and avoid rounding your shoulders as you rise.',
                'Continue to lift until you are standing upright with the barbell in front of your thighs.',
            ],
        },
        {
            stepName: 'Lockout',
            subSteps: [
                'At the top of the lift, fully extend your hips and knees, standing tall.',
                'Keep your shoulders back and your chest out, avoiding any leaning back.',
            ],
        },
        {
            stepName: 'Descent',
            subSteps: [
                'Begin the descent by pushing your hips back while bending your knees slightly.',
                'Lower the barbell in a controlled manner, keeping it close to your body.',
                'Once the barbell passes your knees, bend your knees further to lower the weight to the ground.',
                'Maintain a straight back and avoid rounding your shoulders as you lower the bar.',
            ],
        },
        {
            stepName: 'Reset',
            subSteps: [
                'Once the barbell is back on the ground, reset your position if performing multiple repetitions.',
                'Ensure your feet, grip, and body alignment are correct before initiating the next lift.',
            ],
        },
    ];
}

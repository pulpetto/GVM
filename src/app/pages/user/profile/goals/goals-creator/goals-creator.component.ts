import { animate, style, transition, trigger } from '@angular/animations';
import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseSelectorComponent } from '../goalsCreator/exercise-selector/exercise-selector.component';
import { ExercisePreview } from '../../../../../interfaces/exercise-preview';
import { UserService } from '../../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-goals-creator',
    standalone: true,
    imports: [
        CommonModule,
        ExerciseSelectorComponent,
        FormsModule,
        NgxMaskDirective,
    ],
    templateUrl: './goals-creator.component.html',
    styleUrl: './goals-creator.component.css',
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModal)),
            ]),
            transition(':leave', [
                style(visibleModal),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose2', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
        trigger('openClose3', [
            transition(':enter', [
                style(hiddenBtnFixed),
                animate(timing, style(visibleBtnFixed)),
            ]),
            transition(':leave', [
                style(visibleBtnFixed),
                animate(timing, style(hiddenBtnFixed)),
            ]),
        ]),
    ],
})
export class GoalsCreatorComponent {
    userService = inject(UserService);
    destroyRef = inject(DestroyRef);

    newGoalModalVisibility: boolean = false;
    exerciseSelectorModalVisibility: boolean = false;

    selectedExercise: ExercisePreview | null = null;
    estimated1rm!: number;
    goal1rm!: string;

    closeNewGoalModal() {
        this.selectedExercise = null;
        this.newGoalModalVisibility = false;
    }

    selectExercise($event: ExercisePreview) {
        this.selectedExercise = $event;
        this.userService
            .getDoneWorkoutsByExerciseId($event.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((workouts) => {
                workouts.forEach((workout) => {
                    const exercise = workout.exercises.find(
                        (exercise) => exercise.exerciseId === $event.id
                    );

                    let heaviestWeight = 0;
                    let reps = 0;

                    exercise!.sets.forEach((set) => {
                        if (+set.weight > heaviestWeight) {
                            heaviestWeight = +set.weight;
                            reps = +set.reps;
                        }
                    });

                    this.estimated1rm = Math.round(
                        heaviestWeight * (1 + 0.0333 * reps)
                    );
                });
            });
        this.newGoalModalVisibility = true;
    }
}

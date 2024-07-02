import { Component, DestroyRef, inject } from '@angular/core';
import { ExerciseEditModeComponent } from '../../../../shared/exercise-edit-mode/exercise-edit-mode.component';
import { NameEditorComponent } from './name-editor/name-editor.component';
import { ExercisesSelectorComponent } from './exercises-selector/exercises-selector.component';
import { DataService } from '../../../../services/data.service';
import { Exercise } from '../../../../interfaces/exercise';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-creator',
    standalone: true,
    templateUrl: './creator.component.html',
    styleUrl: './creator.component.css',
    imports: [
        ExerciseEditModeComponent,
        NameEditorComponent,
        ExercisesSelectorComponent,
    ],
})
export class CreatorComponent {
    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);

    exercises: Exercise[] = [];

    addExercises($event: Set<number>) {
        $event.forEach((exerciseId: number) => {
            this.dataService
                .getExerciseById(exerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((exercise) => {
                    if (exercise) this.exercises.push(exercise);
                });
        });
    }
}

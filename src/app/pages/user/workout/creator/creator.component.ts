import { Component, inject } from '@angular/core';
import { ExerciseEditModeComponent } from '../../../../shared/exercise-edit-mode/exercise-edit-mode.component';
import { NameEditorComponent } from './name-editor/name-editor.component';
import { ExercisesSelectorComponent } from './exercises-selector/exercises-selector.component';
import { DataService } from '../../../../services/data.service';
import { Exercise } from '../../../../interfaces/exercise';

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

    exercises: Exercise[] = [];

    addExercises($event: Set<number>) {
        $event.forEach((exerciseId: number) => {
            this.dataService
                .getExerciseById(exerciseId)
                .subscribe((exercise) => {
                    if (exercise) this.exercises.push(exercise);
                });
        });
    }
}

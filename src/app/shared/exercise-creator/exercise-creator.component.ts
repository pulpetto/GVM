import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { InstructionStepsComponent } from './instruction-steps/instruction-steps.component';
import { EquipmentSelectorComponent } from './equipment-selector/equipment-selector.component';
import { MuscleGroupSelectorComponent } from './muscle-group-selector/muscle-group-selector.component';
import { RouterModule } from '@angular/router';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Step } from '../../interfaces/step';

@Component({
    selector: 'app-exercise-creator',
    standalone: true,
    imports: [
        InstructionStepsComponent,
        EquipmentSelectorComponent,
        MuscleGroupSelectorComponent,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './exercise-creator.component.html',
    styleUrl: './exercise-creator.component.css',
})
export class ExerciseCreatorComponent {
    adminService = inject(AdminService);
    fb = inject(FormBuilder);

    @ViewChild('thumbnail') thumbnailInput!: ElementRef<HTMLInputElement>;
    @ViewChild('video') videoInput!: ElementRef<HTMLInputElement>;

    selectedThumbnail: string | ArrayBuffer | null = null;
    selectedVideo: string | ArrayBuffer | null = null;

    exerciseForm = this.fb.group({
        name: this.fb.nonNullable.control<string>('', Validators.required),
        thumbnailFile: this.fb.control<File | null>(null, Validators.required),
        mainMuscleGroupsIds: this.fb.nonNullable.array<string>(
            [],
            [Validators.required, Validators.minLength(1)]
        ),
        secondaryMuscleGroupsIds: this.fb.nonNullable.array<string>(
            [],
            [Validators.required, Validators.minLength(1)]
        ),
        equipmentId: this.fb.control<string | null>(null, Validators.required),
        videoFile: this.fb.control<File | null>(null, Validators.required),
        instruction: this.fb.nonNullable.array(
            [],
            [Validators.required, Validators.minLength(3)]
        ),
    });

    get exerciseInstruction(): FormArray {
        return this.exerciseForm.get('instruction') as FormArray;
    }

    get exerciseMainMuscleGroups(): FormArray<FormControl<string | null>> {
        return this.exerciseForm.get('mainMuscleGroupsIds') as FormArray<
            FormControl<string | null>
        >;
    }

    addMainMuscleGroup() {
        this.exerciseMainMuscleGroups.push(this.fb.control(null));
    }

    get exerciseSecondaryMuscleGroups(): FormArray<FormControl<string | null>> {
        return this.exerciseForm.get('secondaryMuscleGroupsIds') as FormArray<
            FormControl<string | null>
        >;
    }

    addSecondaryMuscleGroup() {
        this.exerciseSecondaryMuscleGroups.push(this.fb.control(null));
    }

    onThumbnailSelect() {
        if (this.thumbnailInput.nativeElement.files) {
            const thumbnail = this.thumbnailInput.nativeElement.files[0];
            const reader = new FileReader();

            this.exerciseForm.patchValue({
                thumbnailFile: thumbnail,
            });

            reader.onload = () => {
                this.selectedThumbnail = reader.result;
            };

            reader.readAsDataURL(thumbnail);
        }
    }

    removeThumbnail() {
        this.exerciseForm.patchValue({
            thumbnailFile: null,
        });

        this.selectedThumbnail = null;
    }

    onVideoSelect() {
        if (this.videoInput.nativeElement.files) {
            const video = this.videoInput.nativeElement.files[0];
            const reader = new FileReader();

            this.exerciseForm.patchValue({
                videoFile: video,
            });

            reader.onload = () => {
                this.selectedVideo = reader.result;
            };

            reader.readAsDataURL(video);
        }
    }

    removeVideo() {
        this.exerciseForm.patchValue({
            videoFile: null,
        });

        this.selectedVideo = null;
    }

    setMuscleGroupId(
        $event: string | null,
        type: 'main' | 'secondary',
        $index: number
    ) {
        if (type === 'main') {
            this.exerciseMainMuscleGroups.at($index).setValue($event);
        } else {
            this.exerciseSecondaryMuscleGroups.at($index).setValue($event);
        }
    }

    removeMuscleGroup(type: 'main' | 'secondary', $index: number) {
        if (type === 'main') {
            this.exerciseMainMuscleGroups.removeAt($index);
        } else {
            this.exerciseSecondaryMuscleGroups.removeAt($index);
        }
    }

    addExercise() {
        const formData = this.exerciseForm.value;

        this.adminService.addExercise(
            formData.name!,
            formData.thumbnailFile!,
            formData.mainMuscleGroupsIds!,
            formData.secondaryMuscleGroupsIds!,
            formData.equipmentId!,
            formData.videoFile!,
            formData.instruction as Step[],
            [],
            []
        );
    }
}

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
    fb = inject(FormBuilder);

    @ViewChild('thumbnail') thumbnailInput!: ElementRef<HTMLInputElement>;
    @ViewChild('video') videoInput!: ElementRef<HTMLInputElement>;

    selectedThumbnail: string | ArrayBuffer | null = null;
    selectedVideo: string | ArrayBuffer | null = null;

    exerciseForm = this.fb.group({
        name: ['', Validators.required],
        thumbnailFile: this.fb.control<File | null>(null),
        mainMuscleGroupsIds: this.fb.array<string>([]),
        secondaryMuscleGroupsIds: this.fb.array<string>([]),
        equipmentId: this.fb.control<string | null>(null),
        videoFile: this.fb.control<File | null>(null),
    });

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

    setEquipmentId($event: string | null) {
        this.exerciseForm.patchValue({
            equipmentId: $event,
        });
    }
}

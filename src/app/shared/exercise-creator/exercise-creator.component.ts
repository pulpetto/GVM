import {
    Component,
    DestroyRef,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { InstructionStepsComponent } from './instruction-steps/instruction-steps.component';
import { EquipmentSelectorComponent } from './equipment-selector/equipment-selector.component';
import { MuscleGroupSelectorComponent } from './muscle-group-selector/muscle-group-selector.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { ExercisePreview } from '../../interfaces/exercise-preview';
import { DataService } from '../../services/data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class ExerciseCreatorComponent implements OnInit {
    view!: 'new' | 'existing';

    adminService = inject(AdminService);
    dataService = inject(DataService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    fb = inject(FormBuilder);
    destroyRef = inject(DestroyRef);

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

    ngOnInit() {
        const hasIdParam = this.route.snapshot.paramMap.has('id');

        if (hasIdParam) {
            const exerciseId = this.route.snapshot.paramMap.get('id');

            this.view = 'existing';

            if (history.state.previewData) {
                // prettier-ignore
                const exercisePreviewData = history.state.previewData as ExercisePreview;

                this.exerciseForm
                    .get('name')
                    ?.setValue(exercisePreviewData.name);
                this.selectedThumbnail = exercisePreviewData.imagePreviewUrl;

                const mainMuscleGroupsIds = this.exerciseForm.get(
                    'mainMuscleGroupsIds'
                ) as FormArray;

                exercisePreviewData.mainMuscleGroupsIds.forEach((id) => {
                    mainMuscleGroupsIds.push(this.fb.control(id));
                });

                const secondaryMuscleGroupsIds = this.exerciseForm.get(
                    'secondaryMuscleGroupsIds'
                ) as FormArray;

                exercisePreviewData.secondaryMuscleGroupsIds.forEach((id) => {
                    secondaryMuscleGroupsIds.push(this.fb.control(id));
                });

                this.exerciseForm
                    .get('equipmentId')
                    ?.setValue(exercisePreviewData.equipmentId);
            } else {
                this.dataService
                    .getExercisePreview$(exerciseId!)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((data) => {
                        this.exerciseForm.get('name')?.setValue(data.name);
                        this.selectedThumbnail = data.imagePreviewUrl;

                        const mainMuscleGroupsIds = this.exerciseForm.get(
                            'mainMuscleGroupsIds'
                        ) as FormArray;

                        data.mainMuscleGroupsIds.forEach((id) => {
                            mainMuscleGroupsIds.push(this.fb.control(id));
                        });

                        const secondaryMuscleGroupsIds = this.exerciseForm.get(
                            'secondaryMuscleGroupsIds'
                        ) as FormArray;

                        data.secondaryMuscleGroupsIds.forEach((id) => {
                            secondaryMuscleGroupsIds.push(this.fb.control(id));
                        });

                        this.exerciseForm
                            .get('equipmentId')
                            ?.setValue(data.equipmentId);
                    });
            }

            this.dataService
                .getExerciseDetails$(exerciseId!)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data) => {
                    // jeszcze path image'a i video
                    this.selectedVideo = data.instructionVideoPreviewUrl;

                    const instruction = this.exerciseForm.get(
                        'instruction'
                    ) as FormArray;

                    data.instructionSteps.forEach((step) => {
                        const localStep = this.fb.group({
                            name: step.name,
                            subSteps: this.fb.array([]),
                        });

                        step.subSteps.forEach((subStep) => {
                            localStep.controls.subSteps.push(
                                this.fb.control(subStep)
                            );
                        });

                        instruction.push(localStep);
                    });
                });
        } else {
            this.view = 'new';
        }
    }

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

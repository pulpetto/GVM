import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    OnDestroy,
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
import { ActivityBarComponent } from '../activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../previous-route-button/previous-route-button.component';
import { NavbarVisibilityService } from '../../services/navbar-visibility.service';
import { UserService } from '../../services/user.service';
import { ExerciseDetails } from '../../interfaces/exercise-details';

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
        ActivityBarComponent,
        PreviousRouteButtonComponent,
    ],
    templateUrl: './exercise-creator.component.html',
    styleUrl: './exercise-creator.component.css',
})
export class ExerciseCreatorComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    view!: 'new' | 'existing';

    adminService = inject(AdminService);
    dataService = inject(DataService);
    navbarVisibilityService = inject(NavbarVisibilityService);
    cdr = inject(ChangeDetectorRef);
    route = inject(ActivatedRoute);
    router = inject(Router);
    fb = inject(FormBuilder);
    destroyRef = inject(DestroyRef);
    userService = inject(UserService);

    @ViewChild('thumbnail') thumbnailInput!: ElementRef<HTMLInputElement>;
    @ViewChild('video') videoInput!: ElementRef<HTMLInputElement>;

    selectedThumbnail: string | ArrayBuffer | null = null;
    selectedVideo: string | ArrayBuffer | null = null;

    exerciseForm = this.fb.group({
        name: this.fb.nonNullable.control<string>('', Validators.required),
        thumbnailFile: this.fb.control<File | string | null>(
            null,
            Validators.required
        ),
        mainMuscleGroupsIds: this.fb.nonNullable.array<string>(
            [],
            [Validators.required, Validators.minLength(1)]
        ),
        secondaryMuscleGroupsIds: this.fb.nonNullable.array<string>(
            [],
            [Validators.required, Validators.minLength(1)]
        ),
        equipmentId: this.fb.control<string | null>(null, Validators.required),
        videoFile: this.fb.control<File | string | null>(
            null,
            Validators.required
        ),
        instruction: this.fb.nonNullable.array(
            [],
            [Validators.required, Validators.minLength(3)]
        ),
    });

    exerciseDetails!: ExerciseDetails;
    exerciseId!: string | null;

    ngOnInit() {
        const hasIdParam = this.route.snapshot.paramMap.has('id');

        if (hasIdParam) {
            this.exerciseId = this.route.snapshot.paramMap.get('id');

            this.view = 'existing';

            if (history.state.previewData) {
                // prettier-ignore
                const exercisePreviewData = history.state.previewData as ExercisePreview;

                this.exerciseForm.controls.thumbnailFile.setValue(
                    exercisePreviewData.imagePreviewUrl
                );

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
                    .getExercisePreview$(this.exerciseId!)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((data) => {
                        this.exerciseForm.controls.thumbnailFile.setValue(
                            data.imagePreviewUrl
                        );

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
                .getExerciseDetails$(this.exerciseId!)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data) => {
                    this.exerciseDetails = data;

                    this.selectedVideo = data.instructionVideoPreviewUrl;

                    this.exerciseForm.controls.videoFile.setValue(
                        data.instructionVideoPreviewUrl
                    );

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

    ngAfterViewInit() {
        setTimeout(() => {
            this.navbarVisibilityService.visibility.next(false);
        });

        this.cdr.detectChanges();
    }

    get exerciseInstruction(): FormArray {
        return this.exerciseForm.get('instruction') as FormArray;
    }

    get exerciseMainMuscleGroups(): FormArray<FormControl<string | null>> {
        return this.exerciseForm.get('mainMuscleGroupsIds') as FormArray<
            FormControl<string | null>
        >;
    }

    get exerciseSecondaryMuscleGroups(): FormArray<FormControl<string | null>> {
        return this.exerciseForm.get('secondaryMuscleGroupsIds') as FormArray<
            FormControl<string | null>
        >;
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

    addExercise() {
        const formData = this.exerciseForm.value;

        this.adminService.addExercise(
            formData.name!,
            formData.thumbnailFile! as File,
            formData.mainMuscleGroupsIds!,
            formData.secondaryMuscleGroupsIds!,
            formData.equipmentId!,
            formData.videoFile! as File,
            formData.instruction as Step[],
            [],
            []
        );
    }

    modifyExercise() {
        const formData = this.exerciseForm.value;

        this.adminService.updateExercise(
            formData.name!,
            formData.thumbnailFile! as File,
            formData.mainMuscleGroupsIds!,
            formData.secondaryMuscleGroupsIds!,
            formData.equipmentId!,
            formData.videoFile! as File,
            formData.instruction as Step[],
            [],
            [],
            this.exerciseDetails,
            this.exerciseId!
        );
    }

    ngOnDestroy() {
        this.navbarVisibilityService.visibility.next(true);
    }
}

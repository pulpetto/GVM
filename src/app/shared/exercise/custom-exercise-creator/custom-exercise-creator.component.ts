import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    ViewChild,
} from '@angular/core';
import { ActivityBarComponent } from '../../activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../previous-route-button/previous-route-button.component';
import {
    FormArray,
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NavbarVisibilityService } from '../../../services/navbar-visibility.service';
import { UserService } from '../../../services/user.service';
import { Step } from '../../../interfaces/step';
import { MuscleGroupSelectorComponent } from '../../exercise-creator/muscle-group-selector/muscle-group-selector.component';
import { EquipmentSelectorComponent } from '../../exercise-creator/equipment-selector/equipment-selector.component';
import { InstructionStepsComponent } from '../../exercise-creator/instruction-steps/instruction-steps.component';
import { ExercisePreviewFull } from '../../../interfaces/exercise-preview-full';
import { ExerciseDetails } from '../../../interfaces/exercise-details';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-custom-exercise-creator',
    standalone: true,
    imports: [
        CommonModule,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
        ReactiveFormsModule,
        MuscleGroupSelectorComponent,
        EquipmentSelectorComponent,
        InstructionStepsComponent,
        RouterModule,
    ],
    templateUrl: './custom-exercise-creator.component.html',
    styleUrl: './custom-exercise-creator.component.css',
})
export class CustomExerciseCreatorComponent {
    view!: 'new' | 'existing';

    navbarVisibilityService = inject(NavbarVisibilityService);
    cdr = inject(ChangeDetectorRef);
    fb = inject(FormBuilder);
    userService = inject(UserService);
    activatedRoute = inject(ActivatedRoute);

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
        const routeData = history.state.previewData;

        if (routeData) {
            this.exerciseId = this.activatedRoute.snapshot.paramMap.get('id');

            this.view = 'existing';

            const exercisePreviewData =
                routeData.baseData as ExercisePreviewFull;

            this.exerciseForm.controls.thumbnailFile.setValue(
                exercisePreviewData.imagePreviewUrl
            );

            this.exerciseForm.controls.name.setValue(exercisePreviewData.name);

            this.selectedThumbnail = exercisePreviewData.imagePreviewUrl;

            const mainMuscleGroupsIds = this.exerciseForm.get(
                'mainMuscleGroupsIds'
            ) as FormArray;

            exercisePreviewData.mainMuscleGroups.forEach((mg) =>
                mainMuscleGroupsIds.push(this.fb.control(mg.id))
            );

            const secondaryMuscleGroupsIds = this.exerciseForm.get(
                'secondaryMuscleGroupsIds'
            ) as FormArray;

            exercisePreviewData.secondaryMuscleGroups.forEach((mg) =>
                secondaryMuscleGroupsIds.push(this.fb.control(mg.id))
            );

            this.exerciseForm.controls.equipmentId.setValue(
                exercisePreviewData.equipment.id
            );

            this.exerciseDetails = routeData.exetendedData as ExerciseDetails;

            this.selectedVideo =
                this.exerciseDetails.instructionVideoPreviewUrl;

            this.exerciseForm.controls.videoFile.setValue(
                this.exerciseDetails.instructionVideoPreviewUrl
            );

            const instruction = this.exerciseForm.get(
                'instruction'
            ) as FormArray;

            this.exerciseDetails.instructionSteps.forEach((step) => {
                const localStep = this.fb.group({
                    name: step.name,
                    subSteps: this.fb.array([]),
                });

                step.subSteps.forEach((subStep) => {
                    localStep.controls.subSteps.push(this.fb.control(subStep));
                });

                instruction.push(localStep);
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

        this.userService.addCustomExercise(
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

        this.userService.modifyCustomExercise(
            formData.name!,
            formData.thumbnailFile as File,
            formData.mainMuscleGroupsIds!,
            formData.secondaryMuscleGroupsIds!,
            formData.equipmentId!,
            formData.videoFile as File,
            formData.instruction as Step[],
            this.exerciseDetails,
            this.exerciseId!
        );
    }

    ngOnDestroy() {
        this.navbarVisibilityService.visibility.next(true);
    }
}

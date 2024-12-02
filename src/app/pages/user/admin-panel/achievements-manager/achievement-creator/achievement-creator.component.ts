import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivityBarComponent } from '../../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../../shared/previous-route-button/previous-route-button.component';
import { AdminService } from '../../../../../services/admin.service';
import { ToastService } from '../../../../../services/toast.service';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../../../shared/input/input.component';
import { CommonModule } from '@angular/common';
import { Tier } from '../../../../../interfaces/tier';

@Component({
    selector: 'app-achievement-creator',
    standalone: true,
    imports: [
        ActivityBarComponent,
        PreviousRouteButtonComponent,
        InputComponent,
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
    ],
    templateUrl: './achievement-creator.component.html',
    styleUrl: './achievement-creator.component.css',
})
export class AchievementCreatorComponent {
    router = inject(Router);
    adminService = inject(AdminService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);

    @ViewChild('thumbnail') thumbnailInput!: ElementRef<HTMLInputElement>;

    selectedThumbnail: string | ArrayBuffer | null = null;

    achievementForm = this.fb.group({
        thumbnailFile: this.fb.control<File | null>(null, Validators.required),
        name: this.fb.control<string>('', Validators.required),
        type: this.fb.control<string>('', Validators.required),
        description: this.fb.control<string>('', Validators.required),
        tiers: this.fb.array(
            [
                this.createTier(),
                this.createTier(),
                this.createTier(),
                this.createTier(),
            ],
            [Validators.required, this.validateTiers()]
        ),
    });

    get tiers(): FormArray<
        FormGroup<{
            from: FormControl<number | null>;
            to: FormControl<number | null>;
        }>
    > {
        return this.achievementForm.get('tiers') as FormArray;
    }

    createTier(): FormGroup<{
        from: FormControl<number | null>;
        to: FormControl<number | null>;
    }> {
        return this.fb.group({
            from: this.fb.control<number | null>(null, Validators.required),
            to: this.fb.control<number | null>(null, Validators.required),
        });
    }

    validateTiers(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const tiers = control.value as Array<{ from: number; to: number }>;
            if (!tiers || tiers.length < 2) return null;

            for (let i = 0; i < tiers.length; i++) {
                const { from, to } = tiers[i];

                if (from >= to) {
                    return {
                        invalidRange: `Tier ${
                            i + 1
                        }: FROM must be less than TO`,
                    };
                }

                if (i < tiers.length - 1) {
                    const nextFrom = tiers[i + 1]?.from;
                    if (to !== nextFrom) {
                        return {
                            mismatch: `Tier ${
                                i + 1
                            }: TO must equal the next tier's FROM`,
                        };
                    }
                }
            }

            return null;
        };
    }

    onNewAchievementImageSelect() {
        if (this.thumbnailInput.nativeElement.files) {
            this.achievementForm
                .get('thumbnailFile')
                ?.setValue(this.thumbnailInput.nativeElement.files[0]);

            const reader = new FileReader();

            reader.onload = () => {
                this.selectedThumbnail = reader.result;
            };

            reader.readAsDataURL(this.thumbnailInput.nativeElement.files[0]);
        }
    }

    onNewAchievementImageRemove() {
        this.selectedThumbnail = null;
        this.achievementForm.get('thumbnailFile')?.setValue(null);
    }

    async addNewAchievement() {
        try {
            this.adminService.addAchievement(
                this.achievementForm.get('thumbnailFile')!.value!,
                this.achievementForm.get('name')!.value!,
                this.achievementForm.get('type')!.value!,
                this.achievementForm.get('description')!.value!,
                this.tiers.getRawValue() as Tier[]
            );

            this.router.navigate(['user/admin/achievements']);
            this.achievementForm.reset();
            this.selectedThumbnail = null;
            this.toastService.show('Uploaded successfully', false);
        } catch (error) {
            this.router.navigate(['user/admin/achievements']);
            this.achievementForm.reset();
            this.selectedThumbnail = null;
            this.toastService.show('Upload error occured', true);
        }
    }
}

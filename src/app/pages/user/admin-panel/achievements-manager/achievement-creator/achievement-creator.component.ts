import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivityBarComponent } from '../../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../../shared/previous-route-button/previous-route-button.component';
import { AdminService } from '../../../../../services/admin.service';
import { ToastService } from '../../../../../services/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../../../shared/input/input.component';

@Component({
    selector: 'app-achievement-creator',
    standalone: true,
    imports: [
        ActivityBarComponent,
        PreviousRouteButtonComponent,
        InputComponent,
        ReactiveFormsModule,
        RouterModule,
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
        requiredNumber: this.fb.control<string>('', Validators.required),
        type: this.fb.control<string>('', Validators.required),
        description: this.fb.control<string>('', Validators.required),
    });

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
                +this.achievementForm.get('requiredNumber')!.value!,
                this.achievementForm.get('type')!.value!,
                this.achievementForm.get('description')!.value!
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

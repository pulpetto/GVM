import {
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';
import { AdminService } from '../../../../services/admin.service';
import { Observable } from 'rxjs';
import { Achievement } from '../../../../interfaces/achievement';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/input/input.component';
import { ToastService } from '../../../../services/toast.service';

const visibleModal = { top: '15%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-achievements-manager',
    standalone: true,
    imports: [
        ActivityBarComponent,
        PreviousRouteButtonComponent,
        CommonModule,
        ReactiveFormsModule,
        InputComponent,
    ],
    templateUrl: './achievements-manager.component.html',
    styleUrl: './achievements-manager.component.css',
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
export class AchievementsManagerComponent implements OnInit {
    adminService = inject(AdminService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);

    achievements$!: Observable<Achievement[]>;

    newAchievementModalVisbility: boolean = false;

    @ViewChild('thumbnail') thumbnailInput!: ElementRef<HTMLInputElement>;

    selectedThumbnail: string | ArrayBuffer | null = null;

    achievementForm = this.fb.group({
        thumbnailFile: this.fb.control<File | null>(null, Validators.required),
        name: this.fb.control<string>('', Validators.required),
        requiredNumber: this.fb.control<string>('', Validators.required),
        type: this.fb.control<string>('', Validators.required),
        description: this.fb.control<string>('', Validators.required),
    });

    ngOnInit() {
        this.achievements$ = this.adminService.getAchievements$();
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
                +this.achievementForm.get('requiredNumber')!.value!,
                this.achievementForm.get('type')!.value!,
                this.achievementForm.get('description')!.value!
            );

            this.newAchievementModalVisbility = false;
            this.achievementForm.reset();
            this.toastService.show('Uploaded successfully', false);
        } catch (error) {
            this.newAchievementModalVisbility = false;
            this.achievementForm.reset();
            this.toastService.show('Upload error occured', true);
        }
    }
}

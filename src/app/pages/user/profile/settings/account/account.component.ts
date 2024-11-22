import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivityBarComponent } from '../../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../../shared/previous-route-button/previous-route-button.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../services/user.service';
import { ToastService } from '../../../../../services/toast.service';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormBuilder,
    ValidationErrors,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';

import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [
        ActivityBarComponent,
        PreviousRouteButtonComponent,
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './account.component.html',
    styleUrl: './account.component.css',
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
export class AccountComponent {
    userService = inject(UserService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);

    modalVisibility: boolean = false;

    activeModalType!: 'pfp' | 'username' | 'password' | 'deletion';
    activeTitle: string = '';
    activeActionBtnName: string = '';

    // Pfp ---------------------------------------------------------

    @ViewChild('thumbnail') thumbnailInput!: ElementRef<HTMLInputElement>;

    selectedThumbnail: string | ArrayBuffer | null = null;
    selectedThumbnailFile!: File | null;

    openModal(
        modalType: 'pfp' | 'username' | 'password' | 'deletion',
        title: string,
        actionBtnName: string
    ) {
        this.modalVisibility = true;
        this.activeModalType = modalType;
        this.activeTitle = title;
        this.activeActionBtnName = actionBtnName;
    }

    onPfpSelect() {
        if (this.thumbnailInput.nativeElement.files) {
            this.selectedThumbnailFile =
                this.thumbnailInput.nativeElement.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.selectedThumbnail = reader.result;
            };

            reader.readAsDataURL(this.selectedThumbnailFile);
        }
    }

    removePfp() {
        this.selectedThumbnail = null;
    }

    async updatePfp() {
        try {
            this.userService.updatePfp(this.selectedThumbnailFile!);

            this.selectedThumbnail = null;
            this.selectedThumbnailFile = null;

            this.modalVisibility = false;
            this.toastService.show('Pfp updated successfully', false);
        } catch {
            this.modalVisibility = false;
            this.toastService.show('Modification error', true);
        }
    }

    // Username ----------------------------------------------------------
    usernameForm = this.fb.group({
        username: this.fb.control('', {
            validators: [Validators.required],
            asyncValidators: [this.usernameAsyncValidator()],
        }),
    });

    usernameAsyncValidator(): AsyncValidatorFn {
        return (
            control: AbstractControl
        ): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }

            return of(control.value).pipe(
                debounceTime(300),
                switchMap((username) =>
                    this.userService.checkIfUserExists(username)
                ),
                map((exists) =>
                    exists ? { usernameAlreadyTaken: true } : null
                ),
                catchError((error) => {
                    console.error('Error checking username:', error);
                    return of({ serverError: true });
                })
            );
        };
    }

    changeUsername() {
        this.userService.changeUsername(
            this.usernameForm.controls.username.value!
        );

        this.usernameForm.reset();

        this.modalVisibility = false;
    }
}

import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurrentGoal } from '../../../../../interfaces/goals/current-goal';
import { UserService } from '../../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-goal',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, NgxMaskDirective],
    templateUrl: './goal.component.html',
    styleUrl: './goal.component.css',
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
export class GoalComponent {
    @Input({ required: true }) goal!: CurrentGoal;
    @Input({ required: true }) optionsVisbility!: boolean;

    userService = inject(UserService);

    optionsModalVisibility: boolean = false;
    targerWeightChangeModalVisibility: boolean = false;
    newTargerWeight!: number;

    changeTargerWeight() {
        this.userService.updateGoalTargetWeight(
            this.goal.id,
            +this.newTargerWeight
        );

        this.optionsModalVisibility = false;
        this.targerWeightChangeModalVisibility = false;
    }

    deleteGoal() {
        this.userService.deleteGoal(this.goal.id);
    }

    toggleOptionsModal() {
        this.optionsModalVisibility = !this.optionsModalVisibility;

        if (this.optionsModalVisibility) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}

import { CanDeactivateFn } from '@angular/router';

export const workoutEditGuard: CanDeactivateFn<unknown> = (
    component,
    currentRoute,
    currentState,
    nextState
) => {
    return true;
};

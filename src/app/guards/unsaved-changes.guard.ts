import { CanDeactivateFn } from '@angular/router';

export const unsavedChangesGuard: CanDeactivateFn<unknown> = (
    component,
    currentRoute,
    currentState,
    nextState
) => {
    const leaveConfirmation = confirm(
        'Unsaved changes will be lost. Are you sure you want to leave?'
    );

    if (leaveConfirmation) {
        return true;
    } else {
        return false;
    }
};

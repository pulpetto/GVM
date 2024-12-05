import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);

    const user = userService.getUser();
    if (user?.role === 'admin') {
        return true;
    } else {
        router.navigate(['/unauthorized']);
        return false;
    }
};

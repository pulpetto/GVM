import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);

    const user = userService.getUser;

    return toObservable(user).pipe(
        filter((user) => !!user),
        map((user) => {
            if (user?.role === 'admin') {
                return true;
            } else {
                router.navigate(['/unauthorized']);
                return false;
            }
        })
    );
};

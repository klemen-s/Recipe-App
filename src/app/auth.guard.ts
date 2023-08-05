import { CanActivateFn, Router } from '@angular/router';
import { GlobalServiceService } from './global-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const globalService: GlobalServiceService = inject(GlobalServiceService);
  const router: Router = inject(Router);

  if (globalService.getToken() !== null) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
};

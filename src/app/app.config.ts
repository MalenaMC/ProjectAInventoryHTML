import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authRoutes } from './auth/auth.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { pagesRoutes } from './pages/pages.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    provideRouter(routes),
    provideRouter(authRoutes),
    provideRouter(pagesRoutes),
    provideClientHydration(
      withHttpTransferCacheOptions({
				includePostRequests: true,
			}),
    ), 
    provideHttpClient(withFetch())
  ]
};

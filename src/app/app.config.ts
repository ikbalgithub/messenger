import { provideHttpClient,HttpClientModule } from '@angular/common/http';

import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';

import { authenticationReducer } from './ngrx/reducers/authentication.reducer'
import { authorizationReducer } from './ngrx/reducers/authorization.reducer'
import { userReducer } from './ngrx/reducers/user.reducer'

import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimations } from '@angular/platform-browser/animations';



const storage = {
  authentication:authenticationReducer,
  authorization:authorizationReducer,
  user:userReducer
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore({...storage}),
    provideStoreDevtools({ 
      maxAge: 25, 
      logOnly: !isDevMode() 
    })
]
};

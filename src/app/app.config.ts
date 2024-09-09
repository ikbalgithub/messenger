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
import { provideServiceWorker } from '@angular/service-worker';
import { messagesReducer } from './ngrx/reducers/messages.reducer';
import { historyReducer } from './ngrx/reducers/history.reducer';

import { HttpLink } from 'apollo-angular/http';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client';

const storage = {
  authentication:authenticationReducer,
  authorization:authorizationReducer,
  user:userReducer,
  messages:messagesReducer,
  history:historyReducer
}

const uri = 'https://api-production-bdf9.up.railway.app'

const graphQLConfig = {
  deps:[HttpLink],
  provide:APOLLO_OPTIONS,
  useFactory:(httpLink:HttpLink):ApolloClientOptions<unknown> => ({
    link:ApolloLink.from([httpLink.create({uri})]),
    cache: new InMemoryCache()
  })
}

const devTooolsConfig = {maxAge:25,logOnly:!isDevMode}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore({ ...storage }),
    provideStoreDevtools(devTooolsConfig),
    graphQLConfig
  ]
};

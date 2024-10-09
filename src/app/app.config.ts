import { provideHttpClient,HttpClientModule } from '@angular/common/http';

import { ApplicationConfig,inject,isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';

import { authenticationReducer } from './ngrx/reducers/authentication.reducer'
import { authorizationReducer } from './ngrx/reducers/authorization.reducer'
import { userReducer } from './ngrx/reducers/user.reducer'

import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimations } from '@angular/platform-browser/animations';
import { messagesReducer } from './ngrx/reducers/messages.reducer';
import { historyReducer } from './ngrx/reducers/history.reducer';
import { provideApollo,APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client';



const storage = {
  authentication:authenticationReducer,
  authorization:authorizationReducer,
  user:userReducer,
  messages:messagesReducer,
  history:historyReducer
}

const uri = 'https://nest.loca.lt/graphql'

const devTooolsConfig = {maxAge:25,logOnly:!isDevMode}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore({ ...storage }),
    provideStoreDevtools(devTooolsConfig),
    provideApollo(() => {
      const httpLink = inject(HttpLink)
      return {
        link:httpLink.create({uri}),
        cache:new InMemoryCache()
      }
    })
  ]
};

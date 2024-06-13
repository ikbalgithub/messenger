import { Routes } from '@angular/router';
import { DetailComponent } from './routes/detail/detail.component'
import { HomeComponent } from './routes/home/home.component'
import { LoginComponent } from './routes/login/login.component'
import { MessagesComponent } from './routes/messages/messages.component'
import { ErrorComponent } from './routes/error/error.component'
import { MessageComponent } from './routes/message/message.component'
import { SearchComponent } from './routes/search/search.component'
import { RegisterComponent } from './routes/register/register.component'
import { ProfileComponent } from './routes/profile/profile.component'
import { AccountComponent } from './routes/account/account.component'
import { VerificationComponent } from './routes/verification/verification.component'
import { authGuard } from './guards/auth/auth.guard'
import { canDeactivateGuard } from './guards/canDeactivate/can-deactivate.guard';

export const routes: Routes = [
  {
  	path:'',
  	component:MessagesComponent,
    canActivate:[authGuard]
  },
  {
  	path:'login',
  	component:LoginComponent,
    canActivate:[authGuard]
  },
  {
    path:'message/:_id',
    component:MessageComponent,
    canActivate:[authGuard]
  },
  {
    path:'search',
    component:SearchComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'verification',
    component:VerificationComponent
  },
  {
    path:'settings/account',
    component:AccountComponent
  },
  {
    path:'settings/profile',
    component:ProfileComponent
  },
  {
    path:'messages',
    component:MessagesComponent,
    canDeactivate:[canDeactivateGuard]
  },
  {
    path:'messages/:_id',
    component:DetailComponent,
    canDeactivate:[canDeactivateGuard]
  },
  {
    path:"**",
    component:ErrorComponent
  }
]

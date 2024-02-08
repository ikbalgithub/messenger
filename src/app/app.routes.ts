import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component'
import { LoginComponent } from './routes/login/login.component'
import { ErrorComponent } from './routes/error/error.component'
import { MessageComponent } from './routes/message/message.component'
import { SearchComponent } from './routes/search/search.component'
import { RegisterComponent } from './routes/register/register.component'
import { ProfileComponent } from './routes/profile/profile.component'
import { VerificationComponent } from './routes/verification/verification.component'
import { authGuard } from './guards/auth/auth.guard'

export const routes: Routes = [
  {
  	path:'',
  	component:HomeComponent,
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
    path:'profile',
    component:ProfileComponent,
    data:{
      editable:true
    }
  },
  {
    path:'profile/:_id',
    component:ProfileComponent,
    data:{
      editable:false
    }
  },
  {
    path:"**",
    component:ErrorComponent
  }
]

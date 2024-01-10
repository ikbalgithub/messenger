import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component'
import { LoginComponent } from './routes/login/login.component'
import { ErrorComponent } from './routes/error/error.component'
import { MessageComponent } from './routes/message/message.component'
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
    path:'message',
    component:MessageComponent,
    canActivate:[authGuard]
  },
  {
    path:"**",
    component:ErrorComponent
  }
]

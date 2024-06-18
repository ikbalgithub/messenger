import { Routes } from '@angular/router';
import { DetailComponent } from './routes/detail/detail.component'
import { LoginComponent } from './routes/login/login.component'
import { MessagesComponent } from './routes/messages/messages.component'
import { ErrorComponent } from './routes/error/error.component'
import { SearchComponent } from './routes/search/search.component'
import { RegisterComponent } from './routes/register/register.component'
import { authGuard } from './guards/auth/auth.guard'

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
    path:'search',
    component:SearchComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'messages/:_id',
    component:DetailComponent,
    canActivate:[authGuard]
  },
  {
    path:"**",
    component:ErrorComponent
  }
]

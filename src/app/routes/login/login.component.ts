import { Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component,inject,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { State,Authenticated,Credential } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { AuthService } from '../../services/auth/auth.service'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[RequestService],
  imports:[CommonModule,ReactiveFormsModule],
  animations: [
    trigger('loginFailed', [
      state('fadeIn', style({
        position:'relative',
        opacity:1
      })),
      state('fadeOut',style({
        position:'absolute',
        opacity:0
      })),
      transition('fadeOut <=> fadeIn', [
        animate('2s')
      ]),
    ])
  ]
})
export class LoginComponent {
  router = inject(Router)
  store = inject(Store<State>)
  request = inject(RequestService)
  authSvc = inject(AuthService)

  credential:FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })

  loginState = this.request.createInitialState<Authenticated[]>()

  loginRequest = this.request.post<Credential,Authenticated[]>({
    failedCb:e => this.onLoginFailed(e),
    cb:this.onLoginSuccess.bind(this),
    state:this.loginState,
    path:'user/login'
  })

  /*
   * set boolean not found to true if user not found
   */

  notFound = computed<boolean>(() => {
    if(this.loginState().result && (this.loginState().result as Authenticated[]).length < 1){
      return true
    }
    else{
      return false
    }
  })

  /*
   * reset login state to make error message dissapear
   */

  onLoginFailed(e:HttpErrorResponse){
    console.log(e)


    setTimeout(() => {
      this.loginState.update(current => {
        return {
          running:false
        }
     })
    },2000)
  }

  /*
   * when usename and password is valid
   */

  onLoginSuccess([result]:Authenticated[]){
    if(result) this.authSvc.next(result)
  }
}

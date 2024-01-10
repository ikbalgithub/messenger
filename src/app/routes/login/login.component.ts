import { Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component,inject } from '@angular/core';
import { login } from '../../ngrx/actions/auth.actions'
import { set } from '../../ngrx/actions/user.actions' 
import { CommonModule } from '@angular/common';
import { State,User,Credential } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { trigger, state, style, transition, animate } from '@angular/animations';




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
        display:'block',
        opacity:1
      })),
      state('fadeOut', style({
        display:'none',
        opacity:0
      })),
      transition('fadeIn <=> fadeOut', [
        animate('2s')
      ]),
    ])
  ]
})
export class LoginComponent {
  router = inject(Router)
  store = inject(Store<State>)
  request = inject(RequestService)

  loginFailed = false

  credential = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })

  loginState = this.request.createInitialState<User[]>()

  loginRequest = this.request.post<Credential,User[]>({
    failedCb:e => console.log(e.message),
    cb:this.onLoggedIn.bind(this),
    state:this.loginState,
    path:'user/login'
  })

  onLoggedIn([result]:User[]){
    if(result){
      this.store.dispatch(set(result))
      this.store.dispatch(login())
      this.router.navigate([''])
    }
    else{
      this.loginFailed = true

      setTimeout(() => {
        this.loginFailed = false
      },2000)
    }
  }
}

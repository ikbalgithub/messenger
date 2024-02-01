import { Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { Ngrx,Common } from '../../../index.d'
import { FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component,inject,effect,OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../services/request/request.service'
import { AuthService } from '../../services/auth/auth.service'
import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseService } from '../../services/firebase/firebase.service'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports:[CommonModule,ReactiveFormsModule],
})
export class LoginComponent {
  router = inject(Router)
  requestService = inject(RequestService)
  authService = inject(AuthService)
  firebaseService = inject(FirebaseService)
  auth = getAuth()

  errorMessage = signal<null|string>(null)
  placeholder = import.meta.env.NG_APP_PLACEHOLDER

  credential = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  })

  loginState = this.requestService.createInitialState<Common.Authenticated>()

  findOrCreate = this.requestService.post<Common.Oauth,Common.Authenticated>({
    state:this.loginState,
    path:'oauth',
    cb:r => this.authService.next(r),
    failedCb:e => this.errorMessage.update(
      current => e.message
    ),
  })

  setErrorNull = effect(() => {
    var message = this.errorMessage()
    setTimeout(() => this.errorMessage.set(null),3000)
  })


  async login(credential = this.credential as FormGroup){
    try{
      var result = await signInWithEmailAndPassword(
        this.auth, 
        credential.value.email, 
        credential.value.password
      )

      var profile = {
        firstName:'User',
        surname:`${Date.now()}`,
        profileImage:this.placeholder
      }

      var newUser = {
        uid:result.user.uid,
        profile:profile
      }

      if(result.user.emailVerified){
        this.findOrCreate(newUser)
      }
      else{
        this.errorMessage.update(
          c => `your account hasn't been verificated yet`
        )
      }
    }
    catch(e:any){
      this.errorMessage.update(
        c => e.message
          .match(/\((.*?)\)/)[1]
            .split('/')[1]
              .replace(/-/g, ' ')
      )
    }
  }
}

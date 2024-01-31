import { Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { Ngrx } from '../../../index.d'
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
  providers:[RequestService],
  imports:[CommonModule,ReactiveFormsModule],
})
export class LoginComponent {
  router = inject(Router)
  store = inject(Store<Ngrx.State>)
  request = inject(RequestService)
  authSvc = inject(AuthService)
  firebase = inject(FirebaseService)
  auth = getAuth()

  credential = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  })

  loginState = this.request.createInitialState<any>()
  errorMessage = signal<null|string>(null)

  findOrCreate = this.request.post<any,any>({
    failedCb:e => this.errorMessage.update(
      current => e.message
    ),
    cb:r => this.authSvc.next(r),
    state:this.loginState,
    path:'oauth',
  })

  setErrorNull = effect(() => {
    let message = this.errorMessage()
    setTimeout(() => {
       this.errorMessage.set(null)
    },3000)
  })


  async login(credential = this.credential as FormGroup){
    try{
      var result = await signInWithEmailAndPassword(
        this.auth, 
        credential.value.email, 
        credential.value.password
      )

      if(result.user.emailVerified){
        this.findOrCreate({
          uid:result.user.uid,
          profile:{
            firstName:'User',
            surname:`${Date.now()}`,
            profileImage:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgt6wCXkcc2T3ZYH_hSWtwyBudcZLq-rBMBQ&usqp=CAU'
          }
        })
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

  ngOnInit(){
    
  }
}

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
import { signInWithPopup,GoogleAuthProvider,getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports:[CommonModule,ReactiveFormsModule,RouterLink]
})
export class LoginComponent {
  router = inject(Router)
  requestService = inject(RequestService)
  authService = inject(AuthService)
  firebaseService = inject(FirebaseService)

  credential = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  })

  placeholder = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgt6wCXkcc2T3ZYH_hSWtwyBudcZLq-rBMBQ&usqp=CAU'

  loginState = this.requestService.createInitialState<any>()

  findOrCreate = this.requestService.post<any,any>({
    state:this.loginState,
    path:'oauth',
    cb:r => this.authService.next(r),
    failedCb:err => console.log(err)
  })

  async loginWithGoogle(){
    try{
      var account = await signInWithPopup(
        getAuth(),
        new GoogleAuthProvider()
      )

      var uid = account.user.uid
      var fullName = account?.user.displayName
      var firstName = fullName?.split(" ")[0]
      var surname = fullName?.split(" ")[1]
      var profileImage = account.user.photoURL
      var profile = {firstName,surname,profileImage}
    
      this.findOrCreate({
        profile,
        uid
      })
    }
    catch(e:any){
      console.log(e)
    }
  }


  async login(credential = this.credential as FormGroup){
    try{
      var result = await signInWithEmailAndPassword(
        getAuth(), 
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
        console.log('has not been verificated yet')
      }
    }
    catch(e:any){
      console.log(e)
    }
  }
}

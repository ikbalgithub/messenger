import { User } from "firebase/auth"
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Component,inject,OnInit,signal,effect } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'
import { RequestService } from '../../services/request/request.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms'
import { GoogleAuthProvider,getAuth,signInWithPopup,createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { FirebaseService } from '../../services/firebase/firebase.service'
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router'


@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [
    ButtonModule,
    CommonModule,
    ProgressSpinnerModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule
  ]
})
export class RegisterComponent{
  router = inject(Router)
  authService = inject(AuthService)
  requestService = inject(RequestService)
  firebaseService = inject(FirebaseService)
  auth = getAuth()
   
  verification = this.requestService.createInitialState<any>()

  findOrCreateNewAccount = this.requestService.post<any,any>({
    failedCb:message => console.error(message),
    cb:r => this.authService.next(r),
    state:this.verification,
    path:'oauth'
  })
  

  async signUpWithGoogle(){
    try{
      var account = await signInWithPopup(
        this.auth,
        new GoogleAuthProvider()
      )

      var uid = account.user.uid
      var fullName = account?.user.displayName
      var firstName = fullName?.split(" ")[0]
      var surname = fullName?.split(" ")[1]
      var profileImage = account.user.photoURL
      var profile = {firstName,surname,profileImage}

      this.findOrCreateNewAccount({
        profile, 
        uid
      })
    }
    catch(e:any){
      console.error(e)
    }
  }
}

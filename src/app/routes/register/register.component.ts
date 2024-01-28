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
  ]
})
export class RegisterComponent implements OnInit{
  router = inject(Router)
  authService = inject(AuthService)
  requestService = inject(RequestService)
  firebaseService = inject(FirebaseService)

  messages = [{ severity: 'error', summary: 'Failed', detail: 'failed'}]

  authInfo:FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })

  withEmail = false
  
  info = "https://www.googleapis.com/auth/userinfo"
  signUpWithEmailErrorMessage = signal<string>('')
  signUpWithGoogleMessage = signal<null|string>(null)
  successSignUpWithEmail = signal<boolean>(false)

  setErrorNull = effect(() => {
    let message = this.signUpWithGoogleMessage()
    setTimeout(() => {
       this.signUpWithGoogleMessage.set(null)
    },3000)
  })

 
  provider = new GoogleAuthProvider()
  isUserExist = this.requestService.createInitialState<any>()

  findOrCreate = this.requestService.post<any,any>({
    failedCb:e => this.signUpWithGoogleMessage.set(
      e.message
    ),
    cb:r => this.authService.next(r),
    state:this.isUserExist,
    path:'oauth'
  })
  

  async signUpWithGoogle(){
    try{
      var {user} = await signInWithPopup(
        getAuth(),
        this.provider
      )

      this.findOrCreate({
        profile:{
          firstName:user?.displayName?.split(" ")[0],
          surname:user?.displayName?.split(" ")[1],
          profileImage:user.photoURL,
        }, 
        uid:user.uid
      })
    }
    catch(e:any){
      this.signUpWithGoogleMessage.update(
        current => e.message
          .match(/\((.*?)\)/)[1]
            .split('/')[1]
              .replace(/-/g, ' ')
      )
    }
  }

  async signUpWithEmail(){
    try{
      var result = await createUserWithEmailAndPassword(
        getAuth(),
        this.authInfo.value.email,
        this.authInfo.value.password
      )

      this.successSignUpWithEmail.set(true)

      //sendEmailVerification(result.user)
    }
    catch(e:any){
      this.signUpWithEmailErrorMessage.set(
        e.message
          .match(/\((.*?)\)/)[1]
            .split('/')[1]
              .replace(/-/g, ' ')
      )
    }
  }

  ngOnInit(){
    ['.email','.profile'].forEach(s => {
      this.provider.addScope(
        `${this.info}${s}`
      )
    })
  }
}

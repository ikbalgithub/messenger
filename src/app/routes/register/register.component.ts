import { CommonModule } from '@angular/common';
import { Component,inject,OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth/auth.service'
import { RequestService } from '../../services/request/request.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GoogleAuthProvider,getAuth,signInWithPopup,fetchSignInMethodsForEmail } from "firebase/auth";
import { FirebaseService } from '../../services/firebase/firebase.service'

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [
    ButtonModule,
    CommonModule,
    ProgressSpinnerModule
  ]
})
export class RegisterComponent implements OnInit{
  authService = inject(AuthService)
  requestService = inject(RequestService)
  firebaseService = inject(FirebaseService)
  
  info = "https://www.googleapis.com/auth/userinfo"
 
  provider = new GoogleAuthProvider()
  isUserExist = this.requestService.createInitialState<any>()

  findOrCreate = this.requestService.post<any,any>({
    cb:r => this.authService.next(r),
    failedCb:e => console.log(e),
    state:this.isUserExist,
    path:'oauth'
  })
  

  async loginWithGoogle(){
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
    catch(e){
      console.log(e)
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

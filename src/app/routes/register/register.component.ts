import { CommonModule } from '@angular/common';
import { Component,inject,OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth/auth.service'
import { RequestService } from '../../services/request/request.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
export class RegisterComponent implements OnInit {
  request = inject(RequestService)
  authService = inject(AuthService)

  oauthCh: BroadcastChannel = new BroadcastChannel('oauth')
  
  loginGoogleState = this.request.createInitialState<string>()
  loginGoogleFn = this.request.get<string>({
    state:this.loginGoogleState,
    cb:r => window.open(r),
    failedCb:e=> console.log(e)
  })

  loginWithGoogle(){
    this.loginGoogleFn(
      'oauth',{
        responseType:'text'
      }
    )
  }

  ngOnInit(){
    this.oauthCh.onmessage = e => {
      this.authService.next(
        e.data
      )
    }
  }
}

import { Component,inject,OnInit,signal } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAuth,applyActionCode } from "firebase/auth";
import { FirebaseService } from '../../services/firebase/firebase.service'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { CommonService } from '../../services/common/common.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [ProgressSpinnerModule,CommonModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent implements OnInit {
  firebase = inject(FirebaseService)
  auth = getAuth(this.firebase.app)
  common = inject(CommonService)
  router = inject(Router)
  mode = this.common.getParameterByName('mode')
  code = this.common.getParameterByName('oobCode');
  next = this.common.getParameterByName('continueUrl');
  lang = this.common.getParameterByName('lang');
  isFailed = signal<boolean>(false)
  isSuccess = signal<boolean>(false)

  ngOnInit(){
    (async function(auth:any,code:any,success:any,failed:any){
      try{
        await applyActionCode(
          auth,code
        )

        success.set(true)
      }
      catch(e:any){
        console.log(e.message)
        failed.set(true)
      }
    })
    (
      this.auth,
      this.code,
      this.isSuccess,
      this.isFailed
    )
  }
}

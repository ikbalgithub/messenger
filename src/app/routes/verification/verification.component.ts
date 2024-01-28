import { Component,inject,OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAuth,applyActionCode } from "firebase/auth";
import { FirebaseService } from '../../services/firebase/firebase.service'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { CommonService } from '../../services/common/common.service'

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent implements OnInit {
  firebase = inject(FirebaseService)
  auth = getAuth(this.firebase.app)
  common = inject(CommonService)
  mode = this.common.getParameterByName('mode')
  code = this.common.getParameterByName('oobCode');
  next = this.common.getParameterByName('continueUrl');
  lang = this.common.getParameterByName('lang');

  ngOnInit(){
    (async function(auth:any,code:any){
      try{
        await applyActionCode(
          auth,code
        )
      }
      catch(e:any){
        console.log(e.message)
      }
    })
    (
      this.auth,
      this.code
    )
  }
}

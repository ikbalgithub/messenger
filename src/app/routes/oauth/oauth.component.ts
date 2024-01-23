import { Component,OnInit,inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { RequestService } from '../../services/request/request.service'
import { Authenticated } from '../../../index.d'
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css'
})
export class OauthComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute)
  request = inject(RequestService)

  code = this.activatedRoute.snapshot.queryParamMap.get('code')
  oauthCh: BroadcastChannel = new BroadcastChannel('oauth')

  oauthState = this.request.createInitialState<Authenticated[]>()

  oauthFn = this.request.get<Authenticated[]>({
    cb:r => this.next(r),
    failedCb:r => console.log(r),
    state:this.oauthState
  })

  ngOnInit(){
    this.oauthFn(`oauth/callback?code=${this.code}`)
  }

  next([user]:Authenticated[]){
    this.oauthCh.postMessage(
      user
    )

    window.close()
  }
  
}

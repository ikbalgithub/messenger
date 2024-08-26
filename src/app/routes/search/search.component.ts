import { HttpHeaders } from '@angular/common/http';
import { Component,inject,signal,effect,Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Location,CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router'
import { Search } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common/common.service'
import { StoreService } from '../../services/store/store.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LastMessageComponent } from '../../components/last-message/last-message.component'
import { ProfilePipe } from '../../pipes/profile/profile.pipe'
import { ToStringPipe } from '../../pipes/toString/to-string.pipe'
import { Types } from 'mongoose';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  imports: [
    ProgressSpinnerModule,
    LastMessageComponent,
    InputTextModule,
    CommonModule,
    FormsModule,
    ProfilePipe,
    ToStringPipe,
    RouterLink,
    RouterOutlet,
    AvatarModule,
    BadgeModule,
    ButtonModule
  ],

})
export class SearchComponent {
  query = ''

  location = inject(Location)
  requestService = inject(RequestService)
  storeService = inject(StoreService)
  commonService = inject(CommonService)
    
  user = this.storeService.user
  hAuth = this.storeService.authorization

  _altId = new Types.ObjectId().toString()

  searchState = this.requestService.createInitialState<Search.Result[]>()
  searchFn = this.requestService.get<Search.Result[]>({
    cb:r => console.log(r),
    failedCb:r => console.log(r),
    state:this.searchState
  })

  onChange(value:string){
    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    if(value.length > 0) this.searchFn(
      `user/search/${value}`,{
        headers
      }
    ) 
  }
}

import { Store } from '@ngrx/store'
import { HttpHeaders } from '@angular/common/http';
import { Component,inject,signal,effect } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Location,CommonModule } from '@angular/common';
import { Router } from '@angular/router'
import { State,Authorization,Search } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common/common.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LastMessageComponent } from '../../components/last-message/last-message.component'
import { ProfilePipe } from '../../pipes/profile/profile.pipe'
import { ToStringPipe } from '../../pipes/toString/to-string.pipe'
import { Types } from 'mongoose';

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
    ToStringPipe
  ],

})
export class SearchComponent {
  query = ''
  location = inject(Location)
  request = inject(RequestService)
  store = inject(Store<State>)
  common = inject(CommonService)
    
  user = toSignal(this.store.select('user'))()
  authorization:Authorization = toSignal(this.store.select('authorization'))()


  searchState = this.request.createInitialState<Search.Result[]>()
  searchFn = this.request.get<Search.Result[]>({
    cb:r => console.log(r),
    failedCb:r => console.log(r),
    state:this.searchState
  })

  onChange(value:string,headers:HttpHeaders = this.common.createHeaders(this.authorization)){
    if(value.length > 0) this.searchFn(
      `user/search/${value}`,{
        headers
      }
    ) 
  }
}

import { HttpHeaders } from '@angular/common/http';
import { Component,inject,signal,effect,Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Location,CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router'
import { Search } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common/common.service'
import { StoreService } from '../../services/store/store.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProfilePipe } from '../../pipes/profile/profile.pipe'
import { ToStringPipe } from '../../pipes/toString/to-string.pipe'
import { Types } from 'mongoose';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Apollo } from 'apollo-angular';
import { FIND_BY_USERNAME } from '../../graphql/graphql.queries';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  imports: [
    ProgressSpinnerModule,
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

  apolloService = inject(Apollo)
  location = inject(Location)
  requestService = inject(RequestService)
  storeService = inject(StoreService)
  commonService = inject(CommonService)
    
  user = this.storeService.user
  hAuth = this.storeService.authorization

  _altId = new Types.ObjectId().toString()

  friendshipIcon = (status:string|boolean):string => {
    var icon = ''
    
    switch(status){
      case 'pending':
        icon = 'pi pi-clock'
        break;
      case 'requested':
        icon = 'pi pi-users'
        break;
      case 'accepted':
        icon = 'pi pi-message'
        break
      case false:
        icon = 'pi pi-plus'
        break
    }

    return icon
  }

  searchState = this.requestService.createInitialState<Search.Result[]>()
  friendshipAcceptanceState = this.requestService.createInitialState<any>()
  friendshipRequestState = this.requestService.createInitialState<any>()
  requestFn = this.requestService.post<{to:string},any>({
    cb:r => console.log(r),
    failedCb:e=> console.log(e),
    path:'friend/request',
    state:this.friendshipRequestState
  })
  acceptFn = this.requestService.post<{_id:string},any>({
    cb:r => console.log(r),
    failedCb:e=> console.log(e),
    path:'friend/accept',
    state:this.friendshipAcceptanceState
  })
  searchFn = this.requestService.get<Search.Result[]>({
    cb:r => console.log(r),
    failedCb:r => console.log(r),
    state:this.searchState
  })

  onChange(value:string){
    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    if(value.length > 0) this.apolloService.watchQuery(
      {
        query:FIND_BY_USERNAME,
        variables:{
          u:value
        },
        context:{
          headers
        }
      }
    )
    .valueChanges.subscribe(
      ({data,error}) => {
        console.log({
          data,
          error
        })
      }
    )
  }

  actions(friendship:string,user:string){
    if(!friendship) this.requestFriendship(user)
    if(friendship === 'requested') this.accept(
      user
    )
  }

  requestFriendship(to:string){
    var result = this.searchState().result
    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    var result = result.map(({profile,...rest}) => {
      var modifiedOne = {
        profile,
        ...rest,
        friendship:'pending'
      }

      var notThisOne = {
        profile,
        ...rest,
      }

      return profile.usersRef === to
        ? modifiedOne
        : notThisOne
    })

    setTimeout(() => {
      this.searchState.update(current => {
        return {
          ...current,
          result
        }
      })
    })

    this.requestFn(
      {to},
      {headers}
    )
  }

  accept(_id:string){
    var result = this.searchState().result
    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    var result = result.map(({profile,...rest}) => {
      var modifiedOne = {
        profile,
        ...rest,
        friendship:'accepted'
      }

      var notThisOne = {
        profile,
        ...rest,
      }

      return profile.usersRef === _id
        ? modifiedOne
        : notThisOne
    })

    setTimeout(() => {
      this.searchState.update(current => {
        return {
          ...current,
          result
        }
      })
    })

    this.acceptFn(
      {_id},
      {headers}
    )
  }
}

import { Ngrx } from '../../../index.d'
import { Store } from '@ngrx/store'
import { Component,inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { setUser } from '../../ngrx/actions/user.actions'
import { HttpHeaders } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { StoreService } from '../../services/store/store.service'
import { RequestService } from '../../services/request/request.service'
import { SettingSidebarComponent } from '../../components/setting-sidebar/setting-sidebar.component'
import { FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [SettingSidebarComponent,DialogModule,InputTextModule,ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  showEditUsername = false
  store = inject(Store<Ngrx.State>)
  storeService = inject(StoreService)
  requestService = inject(RequestService)
  hAuth = this.storeService.authorization

  newUsernameForm = new FormGroup({
    username:new FormControl<string>("")
  })

  updateUsernameState = this.requestService.createInitialState<any>()

  updateUsernameFn = this.requestService.put<{username:string},{username:string}>({
    cb:r => {
      this.store.dispatch(
        setUser({
          ...this.storeService.user(),
          ...r,
        }) 
      )

      this.showEditUsername = false
    },
    failedCb:err => console.log(err),
    state:this.updateUsernameState,
    path:'user/update',
  })

  updateUsername(form:FormGroup){

    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })
    
    this.updateUsernameFn(
      form.value,
      {headers}
    )
  }
}

import { Store } from '@ngrx/store'
import { setUser } from '../../ngrx/actions/user.actions'
import { ref,uploadBytes,getDownloadURL } from 'firebase/storage'
import { Component,inject,signal} from '@angular/core';
import { CommonModule,Location } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Ngrx } from '../../../index.d'
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext';
import { FirebaseService } from '../../services/firebase/firebase.service'
import { CommonService } from '../../services/common/common.service'
import { RequestService } from '../../services/request/request.service'

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [
    AvatarModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule
  ],

})
export class ProfileComponent {
  location = inject(Location)
  store = inject(Store<Ngrx.State>)
  firebase = inject(FirebaseService)
  common = inject(CommonService)
  request = inject(RequestService)
  user = toSignal(this.store.select('user'))()
  authorization = toSignal(this.store.select('authorization'))()

  _ref = ref(this.firebase.storage,`profileImages/${this.user._id}`)
    
  formsUpdate : FormGroup = new FormGroup({
    profileImage:new FormControl(this.user.profile.profileImage),
    firstName:new FormControl(this.user.profile.firstName),
    surname:new FormControl(this.user.profile.surname),
  })

  updateState = this.request.createInitialState<any>()

  update = this.request.put<any,any>({
    state:this.updateState,
    failedCb:e => console.log(e),
    cb:r => this.onSuccessUpdate.bind(this),
    path:'profile'
  })

  onSuccessUpdate({v,_id,...rest}:any){
    setUser({
      ...this.user,
      profile:{
        surname:rest.surname,
        firstName:rest.firstName,
        profileImage:rest.profileImage
      }
    })
  }

  newProfileImage : null | File = null

  onFileChange(event:any){
    let reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.newProfileImage = file
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.formsUpdate.patchValue({
          ...this.formsUpdate.value,
          profileImage:reader.result,
        });
      };
    }
  }

  async setUpdate(){
    try{
      var headers = this.common.createHeaders(this.authorization)
      if(this.newProfileImage){
        var result = await  uploadBytes(this._ref,this.newProfileImage as File)
        var url = await getDownloadURL(result.ref)
        this.formsUpdate.patchValue({
          ...this.formsUpdate.value,
            profileImage:url,
        })

        this.update(this.formsUpdate.value,{
          headers
        })
      }
      else{
        this.update(this.formsUpdate.value,{
          headers
        })
      }
    
      
    } 
    catch(err:any){
      console.log(err.message)
    }
  }
}

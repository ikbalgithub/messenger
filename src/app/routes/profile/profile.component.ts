import { HttpHeaders } from '@angular/common/http';
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
import { StoreService } from '../../services/store/store.service'

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
  storeService = inject(StoreService)
  firebaseService = inject(FirebaseService)
  common = inject(CommonService)
  request = inject(RequestService)
  
  user = this.storeService.user
  authorization = this.storeService.authorization
  uploadRef = `profileImages/${this.user._id}`
  _ref = ref(this.firebaseService.storage,this.uploadRef)
    
  formsUpdate : FormGroup = new FormGroup({
    profileImage:new FormControl(this.user.profile.profileImage),
    firstName:new FormControl(this.user.profile.firstName),
    surname:new FormControl(this.user.profile.surname),
    _id:new FormControl(this.user.profile?._id)
  })

  updateState = this.request.createInitialState<any>()

  update = this.request.put<any,any>({
    state:this.updateState,
    failedCb:e => console.log(e),
    cb:this.onSuccessUpdate.bind(this),
    path:'profile'
  })

  onSuccessUpdate({__v,_id,usersRef,...profile}:any){
    this.storeService.store.dispatch(
      setUser({
        ...this.user,
        profile
      })
    )
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
      var headers = new HttpHeaders({
        authorization:this.authorization
      })
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

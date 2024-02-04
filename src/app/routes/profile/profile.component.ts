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
  requestService = inject(RequestService)
  
  user = this.storeService.user
  profile = this.user().profile
  hAuth = this.storeService.authorization
  uploadRef = `profileImages/${this.user()._id}`
  _ref = ref(this.firebaseService.storage,this.uploadRef)

  newProfileImage : null | File = null
    
  updateForm = new FormGroup({
    profileImage:new FormControl(this.profile.profileImage),
    firstName:new FormControl(this.profile.firstName),
    surname:new FormControl(this.profile.surname),
    _id:new FormControl(this.profile?._id)
  })

  updateState = this.requestService.createInitialState<any>()

  update = this.requestService.put<any,any>({
    state:this.updateState,
    failedCb:e => console.log(e),
    cb:this.onSuccessUpdate.bind(this),
    path:'profile'
  })

  onSuccessUpdate({__v,_id,usersRef,...profile}:any){
    this.storeService.store.dispatch(
      setUser({
        ...this.user(),
        profile
      })
    )
  }

  onFileChange(event:any,form = this.updateForm as FormGroup){
    var reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.newProfileImage = file
      reader.readAsDataURL(file);

      reader.onload = () => {
        form.patchValue({
          ...form.value,
          profileImage:reader.result,
        });
      };
    }
  }

  async setUpdate(form = this.updateForm as FormGroup){
    try{
      var headers = new HttpHeaders({
        authorization:this.hAuth()
      })
      if(this.newProfileImage){
        var result = await  uploadBytes(this._ref,this.newProfileImage as File)
        var url = await getDownloadURL(result.ref)
       
        form.patchValue({
          ...form.value,
          profileImage:url,
        })

        this.update(form.value,{
          headers
        })
      }
      else{
        this.update(form.value,{
          headers
        })
      }
    
      
    } 
    catch(err:any){
      console.log(err.message)
    }
  }
}

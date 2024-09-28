import { Pipe, PipeTransform } from '@angular/core';
import { Message,Search } from '../../../index.d'
import { Modified } from '../../components/history/history.component';

@Pipe({
  name: 'profile',
  standalone: true
})
export class ProfilePipe implements PipeTransform {

  transform(value:Modified,_id:string,pages:string):any {
    
    if(pages === 'home'){
      if(value.detail.sender._id === _id){
        return value.detail.accept.profile
      }
      else{
        return value.detail.sender.profile
      }
    } 
  }

}

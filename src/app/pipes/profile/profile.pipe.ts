import { Pipe, PipeTransform } from '@angular/core';
import { Message,Search } from '../../../index.d'

@Pipe({
  name: 'profile',
  standalone: true
})
export class ProfilePipe implements PipeTransform {

  transform(value:Message.Last|Search.Result,_id:string|null|undefined,pages:string):any {
    if(pages === 'home'){
      var v = value as Message.Last

      if(v.sender.usersRef === _id as string){
        return v.accept
      }
      else{
        return v.sender
      }
    }
    else{
      var {message,...profile} = value as Search.Result

      return profile
    }
    
  }

}

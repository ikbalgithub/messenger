import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../../../index.d'

@Pipe({
  name: 'profile',
  standalone: true
})
export class ProfilePipe implements PipeTransform {

  transform(value:Message.Last,args:string):any {
    if(value.sender.usersRef === args){
      return value.accept
    }
    else{
      return value.sender
    }
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { Message, Ngrx } from '../../..';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value:Ngrx.History[],args:string){
    var [{messages}] = value.filter(m => {
      return m._id === args
    })
    
    return messages
  }

}

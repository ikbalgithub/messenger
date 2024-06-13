import { Pipe, PipeTransform } from '@angular/core';
import { Message, Ngrx } from '../../..';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value:Ngrx.History[]|undefined,args:string):Message.All{
    return (value as Ngrx.History[]).filter(m => m._id === args)[0].messages
  }

}

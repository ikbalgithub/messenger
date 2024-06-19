import { Pipe, PipeTransform } from '@angular/core';
import { Ngrx } from '../../..';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value:Ngrx.Messages[],args:string):Ngrx.Messages{
    return value.filter(m => m._id === args)[0]
  }

}

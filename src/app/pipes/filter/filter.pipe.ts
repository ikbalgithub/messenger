import { Pipe, PipeTransform } from '@angular/core';
import { Ngrx } from '../../..';
import { Cache } from '../../ngrx/actions/messages.actions';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value:Cache[],args:string):Cache{
    return value.filter(m => m._id === args)[0]
  }

}

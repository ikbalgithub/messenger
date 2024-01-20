import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'value',
  standalone: true
})
export class ValuePipe implements PipeTransform {

  transform(value:any,args:any):any {
    return value.target.value
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toInt',
  standalone: true
})
export class ToIntPipe implements PipeTransform {

  transform(value:string):number {
    return parseInt(value)
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentByOwn',
  standalone: true
})
export class SentByOwnPipe implements PipeTransform {

  transform(value:string,args:string):boolean {
    return value === args;
  }

}

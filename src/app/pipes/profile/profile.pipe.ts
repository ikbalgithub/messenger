import { Pipe, PipeTransform } from '@angular/core';
import { Message,Search } from '../../../index.d'
import { History } from '../../components/history/history.component';

@Pipe({
  name: 'profile',
  standalone: true
})
export class ProfilePipe implements PipeTransform {

  transform(value:History[number],_id:string,pages:string):any {
    return 0
  }

}

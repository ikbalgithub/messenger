import { Injectable,inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  createPath(server:string,path:string|undefined):string {
    return `${server}/${path}`
  }
}

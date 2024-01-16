import { Injectable,inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  createPath(server:string,path:string|undefined):string {
    return `${server}/${path}`
  }

  createHeaders(token:string|HttpHeaders):HttpHeaders{
    var authorization = `Bearer ${token}`

    return new HttpHeaders({
      authorization
    })
  }
}

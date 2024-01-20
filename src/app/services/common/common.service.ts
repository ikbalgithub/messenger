import { Injectable,inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Types } from 'mongoose';


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

  getNewId():string{
    return new Types.ObjectId().toString()
  }
}

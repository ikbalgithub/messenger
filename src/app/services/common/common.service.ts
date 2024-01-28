import { Injectable,inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router,Params } from '@angular/router'
import { Types } from 'mongoose';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  route = inject(ActivatedRoute)
  snapshot = this.route.snapshot

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

  getParameterByName(name:string):string|null{
    return this.snapshot.queryParamMap.get(name)
  }
}

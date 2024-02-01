import { Injectable,inject } from '@angular/core';
import { Ngrx } from '../../../index.d'
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router,Params } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop';
import { Types } from 'mongoose';
import { Store } from '@ngrx/store'



@Injectable({
  providedIn: 'root'
})
export class CommonService{
  route = inject(ActivatedRoute)
  snapshot = this.route.snapshot

  createPath(server:string,path:string|undefined):string {
    return `${server}/${path}`
  }

  getParameterByName(name:string):string|null{
    return this.snapshot.queryParamMap.get(name)
  }

  test():string{
    return 'x'
  }
}

interface Test{
  test:() => string
}
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

  relativeTimeFormat(time:number):string{
    var result = 0
    var current = Date.now()
    var diff = current - time
    var formatedResult = ''
    var rtf = new Intl.RelativeTimeFormat()
    var seconds = Math.floor(diff/1000)
    var minutes = Math.floor(seconds/60)
    var hours = Math.floor(minutes/60)
    var days = Math.floor(hours/24)
    var months = Math.floor(days/30)

    if(months > 0){
      result = -months
      formatedResult = rtf.format(
        result,'month'
      )
    }
    else{
      if(days > 0){
        result = -days
        formatedResult = rtf.format(
          result,'day'
        )
      }
      else{
        if(hours > 0){
          result = -hours
          formatedResult = rtf.format(
            result,'hour'
          )
        }
        else{
          result = -minutes
          formatedResult = rtf.format(
            result,'minute'
          )
        }
      }
    }
   
    return formatedResult
  }

  test():string{
    return 'x'
  }
}

interface Test{
  test:() => string
}
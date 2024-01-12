import { Injectable,inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  butProps<T extends Object,K extends string>(obj:T,key:string):Omit<T,K>{
    var keys = Object.keys(obj).filter(k => {
      return k !== key
    })

    var props = keys.map((key) => {
      return {
        [key]:obj[
          key as keyof T
        ]
      }
    })

    return Object.assign(
      {},...props
    )
  }
}

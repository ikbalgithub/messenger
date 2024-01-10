import { throwError } from 'rxjs'
import { timeoutWith } from 'rxjs/operators'
import { Request } from '../../../index.d'
import { Injectable,WritableSignal,signal,inject } from '@angular/core';
import { HttpEvent,HttpClient,HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  server = "http://192.168.43.225:3000"

  httpClient = inject(HttpClient)
 
  createInitialState<Result>():Request.State<Result>{
    return signal<Request.RequestState<Result>>({
      running:false
    })
  }

  post<Body,Result>(config:Request.RequestConfig<Result>):Request.Post<Body>{
    
    var recursive = (this.post<Body,Result>).bind(this)

    var retryFunction = () => { /* run retry ... */ }

    var timeout = new Error("error timeout.........")
    
    var error = (response:HttpErrorResponse) => {
      if(config.failedCb) config.failedCb(
        response
      )
      
      config.state.set({
        running:false,
        error:response,
        retryFunction
      })
    }

    var next = (response:HttpEvent<Result>) => {
      var result = response as Result

      if(config.cb) config.cb(
        result
      )

      config.state.set({
        running:false,
        result
      })
    }


    return (body:Body,options?:any):void => {
      config.state.set({running:true})

      retryFunction = () => recursive(
        config
      )
      (
        body,
        options
      )

      this.httpClient.post<Result>(
        this.createPath(
          config.path
        ),
        body,
        options
      )
      .pipe(
        timeoutWith(
          10000,throwError(
            timeout
          )
        )
      )
      .subscribe({
        error,
        next
      }) 
      
    }
  }

  get<Result>(config:Request.RequestConfig<Result>):Request.Get{

    var recursive = (this.get<Result>).bind(this)

    var retryFunction= () => { /* run retry ... */ }

    var timeout = new Error("error timeout....... ")

    var error = (response:HttpErrorResponse) => {
      if(config.failedCb) config.failedCb(
        response
      )
      
      config.state.set({
        running:false,
        error:response,
        retryFunction
      })
    }

    var next = (response:HttpEvent<Result>) => {
      var result = response as Result

      if(config.cb) config.cb(
        result
      )

      config.state.set({
        running:false,
        result
      })
    }

    return (path:string,options?:any):void => {

      config.state.set({running:true})

      retryFunction = () => recursive(
        config
      )
      (
        path,
        options
      )
      
      this.httpClient.get<Result>(
        this.createPath(path),
        options
      )
      .pipe(
        timeoutWith(
          10000,throwError(
            timeout
          )
        )
      )
      .subscribe({
        error,
        next
      }) 

    }
  }


  createPath(path:string|undefined):string {
    return `${this.server}/${path}`
  }
}

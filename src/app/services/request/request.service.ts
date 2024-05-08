import { throwError } from 'rxjs'
import { timeoutWith } from 'rxjs/operators'
import { Request } from '../../../index.d'
import { CommonService } from '../common/common.service'
import { Injectable,signal,inject } from '@angular/core';
import { HttpEvent,HttpClient,HttpErrorResponse } from '@angular/common/http';

@Injectable({providedIn:'root'}) export class RequestService {

  server     = import.meta.env.NG_APP_SERVER

  httpClient = inject(HttpClient)

  common     = inject(CommonService)
 
  createInitialState<Result>():Request.State<Result>{
    return signal<Request.RequestState<Result>>({
      isError:false,
      running:false,
      result:[] as Result
    })
  }

  post<Body,Result>(config:Request.RequestConfig<Result>):Request.Post<Body>{
    
    var postObject:Body

    var recursive = (this.post<Body,Result>).bind(this)

    var retryFunction = () => { /* run retry ... */ }

    var error = (response:HttpErrorResponse) => {
      var message = response.message

      if(config.failedCb) config.failedCb(
        response,postObject
      )

      config.state.set({
        running:false,
        isError:true,
        message,
        retryFunction,
        result:[] as Result
      })
      
      // config.state.set({
      //   running:false,
      //   error:response,
      //   retryFunction
      // })
    }

    var next = (response:HttpEvent<Result>) => {
      var result = response as Result

      if(config.cb) config.cb(
        result
      )

      config.state.set({
        running:false,
        isError:false,
        result
      })

      // config.state.set({
      //   running:false,
      //   result
      // })
    }


    return (body:Body,options?:any):void => {
      postObject = body

      config.state.set({
        running:true,
        isError:false,
        result:[] as Result
      })

      retryFunction = () => recursive(
        config
      )
      (
        body,
        options
      )

      this.httpClient.post<Result>(
        this.common.createPath(
          this.server,
          config.path
        ),
        body,
        options
      )
      .pipe(
        timeoutWith(
          30000,throwError(
            new Error("timeout")
          )
        )
      )
      .subscribe({
        error,
        next
      }) 
      
    }
  }

  put<Body,Result>(config:Request.RequestConfig<Result>):Request.Put<Body>{
    
    var recursive = (this.put<Body,Result>).bind(this)

    var retryFunction = () => { /* run retry ... */ }
    
    var error = (response:HttpErrorResponse) => {
      var message = response.message
      if(config.failedCb) config.failedCb(
        response
      )

      config.state.set({
        running:false,
        isError:true,
        message,
        retryFunction,
        result:[] as Result
      })
      
      // config.state.set({
      //   running:false,
      //   error:response,
      //   retryFunction
      // })
    }

    var next = (response:HttpEvent<Result>) => {
      var result = response as Result

      if(config.cb) config.cb(
        result
      )

      config.state.set({
        running:false,
        isError:false,
        result
      })

      // config.state.set({
      //   running:false,
      //   result
      // })
    }


    return (body:Body,options?:any):void => {
      config.state.set({
        running:true,
        isError:false,
        result:[] as Result
      })


      retryFunction = () => recursive(
        config
      )
      (
        body,
        options
      )

      this.httpClient.put<Result>(
        this.common.createPath(
          this.server,
          config.path
        ),
        body,
        options
      )
      .pipe(
        timeoutWith(
          30000,throwError(
            new Error("timeout")
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

    var retryFunction = () => { /* run retry */ }

    var error = (response:HttpErrorResponse) => {
      var message = response.message
      if(config.failedCb) config.failedCb(
        response
      )
      
      config.state.set({
        running:false,
        isError:true,
        message,
        retryFunction,
        result:[] as Result
      })

      // config.state.set({
      //   running:false,
      //   error:response,
      //   retryFunction
      // })
    }

    var next = (response:HttpEvent<Result>) => {
      var result = response as Result

      if(config.cb) config.cb(
        result
      )

      config.state.set({
        running:false,
        isError:false,
        result
      })

      // config.state.set({
      //   running:false,
      //   result
      // })
    }

    return (path:string,options?:any):void => {

      config.state.set({
        running:true,
        isError:false,
        result:[] as Result
      })


      retryFunction = () => recursive(
        config
      )
      (
        path,
        options
      )
      
      this.httpClient.get<Result>(
        this.common.createPath(
          this.server,
          path
        ),
        options
      )
      .pipe(
        timeoutWith(
          30000,throwError(
            new Error("timeout")
          )
        )
      )
      .subscribe({
        error,
        next
      }) 

    }
  }
}

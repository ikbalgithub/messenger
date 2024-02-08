import { Injectable,inject } from '@angular/core';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class DecoratorService {
  router = inject(Router)

  Test(){
    return function(target:any,key:PropertyKey){

    }
  }
}

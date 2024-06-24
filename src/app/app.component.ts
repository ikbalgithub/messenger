import { RouterOutlet } from '@angular/router';
import { Component,HostListener,inject } from '@angular/core';
import { CommonModule } from '@angular/common'
import { StoreService } from './services/store/store.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  store = inject(StoreService)
  
  @HostListener('window:beforeunload',['$event']) onBeforeUnload(event:Event){
    var ngrx = localStorage.getItem("ngrx")
    
    var authentication = this.store.authentication()
    var authorization = this.store.authorization()
    var history = this.store.history()
    var messages = this.store.messages()
    var user = this.store.user()

    var jsonState = JSON.stringify({
      authentication,
      authorization,
      history,
      messages,
      user,
    })

    if(ngrx as String){
      localStorage.removeItem(
        "ngrx"
      )

      localStorage.setItem(
        "ngrx",jsonState
      )
    }
    else{
      localStorage.setItem(
        "ngrx",jsonState
      )
    }
  }
}

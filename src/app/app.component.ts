import { RouterOutlet } from '@angular/router';
import { Component,HostListener,OnInit,effect,inject } from '@angular/core';
import { CommonModule } from '@angular/common'
import { StoreService } from './services/store/store.service'
import { SocketService } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  storeService = inject(StoreService)
  socketService = inject(SocketService)
  
  @HostListener('window:beforeunload',['$event']) onBeforeUnload(event:Event){
    var ngrx = localStorage.getItem("ngrx")
    
    var authentication = this.storeService.authentication()
    var authorization = this.storeService.authorization()
    var history = this.storeService.history()
    var messages = this.storeService.messages()
    var user = this.storeService.user()

    var jsonState = JSON.stringify({
      authentication,
      authorization,
      history,
      messages,
      user,
    })

    this.socketService.socket.disconnect()

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

  onAuthenticationStateChange = effect(() => {
    var authState = this.storeService.authentication()

    if(authState.loggedIn){
      this.socketService.socket.connect()
    }
    else{
      this.socketService.socket.disconnect()
    }
  })

 
}

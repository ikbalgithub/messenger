import { RouterOutlet } from '@angular/router';
import { Component,inject } from '@angular/core';
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
  rootInit = this.store.init()
}

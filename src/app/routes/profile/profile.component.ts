import { Component,inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { StoreService } from '../../services/store/store.service'
import { Router } from '@angular/router';



@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [AvatarModule],

})
export class ProfileComponent {
  storeService = inject(StoreService)
  userStore = this.storeService.user()
  
}

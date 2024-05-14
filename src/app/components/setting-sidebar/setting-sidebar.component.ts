import { Component,inject } from '@angular/core';
import { StoreService } from '../../services/store/store.service'
import { Router,RouterLink,RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-setting-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,AvatarModule],
  templateUrl: './setting-sidebar.component.html',
  styleUrl: './setting-sidebar.component.css'
})
export class SettingSidebarComponent {
  storeService = inject(StoreService)
  userStore = this.storeService.user
}

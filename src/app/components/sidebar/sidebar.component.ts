import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StoreService } from '../../services/store/store.service';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ButtonModule,AvatarModule,AvatarGroupModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  router = inject(Router)
  storeService = inject(StoreService)
  user = this.storeService.user()
}

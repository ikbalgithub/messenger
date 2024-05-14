import { Component,inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { StoreService } from '../../services/store/store.service'
import { SettingSidebarComponent } from '../../components/setting-sidebar/setting-sidebar.component'


@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [SettingSidebarComponent]

})
export class ProfileComponent {
}

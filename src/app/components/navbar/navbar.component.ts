import { Component,Input,inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common'
import { Router,RouterLink } from '@angular/router'
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../services/auth/auth.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule,CommonModule,MenuModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() image!:string
  @Input() connected!:boolean
  @Input() surname!:string
  @Input() firstName!:string
  @Input() page!:string
  @Input() _id!:string

  router = inject(Router)
  authService = inject(AuthService)

  options = [
    {
          label: 'Settings',
          icon: 'pi pi-cog',
          command:() => this.router.navigate(['settings/profile'])
    },
    {
          label: 'Logout',
          icon: 'pi pi-power-off',
          command:() => this.authService.logout()
    }
  ]
}

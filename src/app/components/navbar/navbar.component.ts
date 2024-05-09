import { Component,Input,inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../services/auth/auth.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule,CommonModule,MenuModule],
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
      label: 'Options',
      items: [
        {
          label: 'Account Settings',
          icon: 'pi pi-cog',
          command:() => this.router.navigate(['profile'])
        },
        {
          label: 'Logout',
          icon: 'pi pi-power-off',
          command:() => this.authService.logout()
        }
      ]
    }
  ]

  view(){
    this.router.navigate(
      [`profile/${this._id}`],{state:{
        firstName:this.firstName,
        surname:this.surname,
        image:this.image
      }}
    )
  }

}

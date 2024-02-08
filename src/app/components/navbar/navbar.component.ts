import { Component,Input,inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule,CommonModule],
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

import { Component,Input,Output,EventEmitter } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common'

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
  @Output() fn = new EventEmitter<void>()
}

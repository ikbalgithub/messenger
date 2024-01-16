import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Component,Input } from '@angular/core';
import { Profile } from '../../../index.d'
import { ChipModule } from 'primeng/chip';
import { ToStringPipe } from '../../pipes/toString/to-string.pipe'
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-last-message',
  standalone: true,
  imports: [AvatarModule,BadgeModule,AvatarGroupModule,CommonModule,RouterLink],
  templateUrl: './last-message.component.html',
  styleUrl: './last-message.component.css'
})
export class LastMessageComponent {
  @Input() profile!:Profile
  @Input() value!:string
  @Input() unread!:boolean
  @Input() unreadCounter!:string
  @Input() groupId!:string

  count(counter:string):number{
    return parseInt(
      counter
    )
  }
}

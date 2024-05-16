import { Component,Input,ViewEncapsulation,inject } from '@angular/core';
import { CommonService } from '../../services/common/common.service'
import { Message,Ngrx } from '../../../index.d'
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-message-accept',
  standalone: true,
  imports: [CommonModule,ImageModule],
  templateUrl: './message-accept.component.html',
  styleUrl: './message-accept.component.css',
  encapsulation:ViewEncapsulation.None
})
export class MessageAcceptComponent {
  common = inject(CommonService)
  @Input() message!:Message.One
  @Input() isLast!:boolean
}

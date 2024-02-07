import { Message,Ngrx } from '../../../index.d'
import { CommonModule } from '@angular/common'
import { Component,Input,ViewEncapsulation } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageSentComponent } from '../../components/message-sent/message-sent.component'
import { MessageAcceptComponent } from '../../components/message-accept/message-accept.component'
@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    MessageSentComponent,
    MessageAcceptComponent
  ],

})
export class MessagesComponent {
  @Input() onFetch!:boolean
  @Input() messages!:Message.All
  @Input() isError!:boolean
  @Input() userId!:string
}

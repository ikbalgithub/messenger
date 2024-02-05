import { Component,Input } from '@angular/core';
import { Message,Ngrx } from '../../../index.d'

@Component({
  selector: 'app-message-accept',
  standalone: true,
  imports: [],
  templateUrl: './message-accept.component.html',
  styleUrl: './message-accept.component.css'
})
export class MessageAcceptComponent {
  @Input() message!:Message.One
}

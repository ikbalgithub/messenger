import { Component,Input,ViewEncapsulation } from '@angular/core';
import { Message,Ngrx } from '../../../index.d'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-sent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-sent.component.html',
  styleUrl: './message-sent.component.css',
  encapsulation:ViewEncapsulation.None
})
export class MessageSentComponent {
  @Input() message!:Message.One
}

import { Component,Input,ViewEncapsulation } from '@angular/core';
import { Message,Ngrx } from '../../../index.d'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-accept',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-accept.component.html',
  styleUrl: './message-accept.component.css',
  encapsulation:ViewEncapsulation.None
})
export class MessageAcceptComponent {
  @Input() message!:Message.One
}

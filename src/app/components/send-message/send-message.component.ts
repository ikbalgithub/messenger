import { Component,Output,Input,EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone:true,
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.css',
  imports: [
    InputGroupModule,
    ButtonModule,
    ReactiveFormsModule
  ]
})
export class SendMessageComponent {
  @Output() send = new EventEmitter<FormGroup>()
  @Input() newMessage!:FormGroup
  @Input() isValid!:boolean
  @Input() isRunning!:boolean
  // isValid(message:string):boolean{
  //   var regex = /^\s*$/;
  //   return regex.test(
  //     message
  //   ) 
  // }

}

import { Component,Output,Input,EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone:true,
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.css',
  imports: [
    InputGroupModule,
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    ImageModule,
    InputTextModule
  ]
})
export class SendMessageComponent {
  @Output() send = new EventEmitter<FormGroup>()
  @Input() newMessage!:FormGroup
  @Input() isValid!:boolean
  @Input() isRunning!:boolean
  @Input() uploading!:boolean
  @Output() upload = new EventEmitter<File>()

  onFileChange(event:any){
    if(event.target.files && event.target.files.length) {
      this.upload.emit(event.target.files[0])
    }
  }
}

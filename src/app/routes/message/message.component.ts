import { Component,inject } from '@angular/core';
import { ActivatedRoute,Router,Params } from '@angular/router'

@Component({
  selector: 'app-message',
  standalone: true,
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  route = inject(ActivatedRoute)
  _id = this.route.snapshot.params['_id']
}

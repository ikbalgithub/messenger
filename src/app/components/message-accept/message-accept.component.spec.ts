import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageAcceptComponent } from './message-accept.component';

describe('MessageAcceptComponent', () => {
  let component: MessageAcceptComponent;
  let fixture: ComponentFixture<MessageAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageAcceptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

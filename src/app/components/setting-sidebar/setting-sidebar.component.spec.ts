import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSidebarComponent } from './setting-sidebar.component';

describe('SettingSidebarComponent', () => {
  let component: SettingSidebarComponent;
  let fixture: ComponentFixture<SettingSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { updateBusrouteComponent } from './update-busroute.component';

describe('updateBusrouteComponent', () => {
  let component: updateBusrouteComponent;
  let fixture: ComponentFixture<updateBusrouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ updateBusrouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(updateBusrouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

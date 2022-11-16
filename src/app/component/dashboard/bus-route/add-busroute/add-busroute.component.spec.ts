import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusrouteComponent } from './add-busroute.component';

describe('AddBusrouteComponent', () => {
  let component: AddBusrouteComponent;
  let fixture: ComponentFixture<AddBusrouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusrouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBusrouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

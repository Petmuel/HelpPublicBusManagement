import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBusRouteComponent } from './delete-bus-route.component';

describe('DeleteBusRouteComponent', () => {
  let component: DeleteBusRouteComponent;
  let fixture: ComponentFixture<DeleteBusRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBusRouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBusRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

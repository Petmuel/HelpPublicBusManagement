import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusDriverComponent } from './add-bus-driver.component';

describe('AddBusDriverComponent', () => {
  let component: AddBusDriverComponent;
  let fixture: ComponentFixture<AddBusDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBusDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoint2Component } from './add_point2.component';

describe('AddPoint2Component', () => {
  let component: AddPoint2Component;
  let fixture: ComponentFixture<AddPoint2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPoint2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPoint2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

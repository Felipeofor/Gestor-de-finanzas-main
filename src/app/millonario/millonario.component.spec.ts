import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillonarioComponent } from './millonario.component';

describe('MillonarioComponent', () => {
  let component: MillonarioComponent;
  let fixture: ComponentFixture<MillonarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MillonarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MillonarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

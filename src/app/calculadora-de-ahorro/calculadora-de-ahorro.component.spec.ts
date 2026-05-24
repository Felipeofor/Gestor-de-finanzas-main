import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CalculadoraDeAhorroComponent } from './calculadora-de-ahorro.component';

describe('CalculadoraDeAhorroComponent', () => {
  let component: CalculadoraDeAhorroComponent;
  let fixture: ComponentFixture<CalculadoraDeAhorroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ CalculadoraDeAhorroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculadoraDeAhorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

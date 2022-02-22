import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorDeGastosComponent } from './gestor-de-gastos.component';

describe('GestorDeGastosComponent', () => {
  let component: GestorDeGastosComponent;
  let fixture: ComponentFixture<GestorDeGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestorDeGastosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestorDeGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

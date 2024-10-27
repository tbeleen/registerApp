import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleDocentePage } from './detalle-docente.page';

describe('DetalleDocentePage', () => {
  let component: DetalleDocentePage;
  let fixture: ComponentFixture<DetalleDocentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleDocentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

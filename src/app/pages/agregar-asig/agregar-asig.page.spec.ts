import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarAsigPage } from './agregar-asig.page';

describe('AgregarAsigPage', () => {
  let component: AgregarAsigPage;
  let fixture: ComponentFixture<AgregarAsigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAsigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarAsigPage } from './editar-asig.page';

describe('EditarAsigPage', () => {
  let component: EditarAsigPage;
  let fixture: ComponentFixture<EditarAsigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAsigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

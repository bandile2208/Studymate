import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAcademicTermPage } from './add-academic-term.page';

describe('AddAcademicTermPage', () => {
  let component: AddAcademicTermPage;
  let fixture: ComponentFixture<AddAcademicTermPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddAcademicTermPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

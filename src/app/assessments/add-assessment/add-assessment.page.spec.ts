import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAssessmentPage } from './add-assessment.page';

describe('AddAssessmentPage', () => {
  let component: AddAssessmentPage;
  let fixture: ComponentFixture<AddAssessmentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddAssessmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

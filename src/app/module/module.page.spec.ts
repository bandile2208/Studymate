import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModulePage } from './module.page';

describe('ModulePage', () => {
  let component: ModulePage;
  let fixture: ComponentFixture<ModulePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

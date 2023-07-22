import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentsPage } from './assessments.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentsPage
  },
  {
    path: 'add-assessment',
    loadChildren: () => import('./add-assessment/add-assessment.module').then( m => m.AddAssessmentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentsPageRoutingModule {}

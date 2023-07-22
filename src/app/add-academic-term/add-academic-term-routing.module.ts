import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAcademicTermPage } from './add-academic-term.page';

const routes: Routes = [
  {
    path: '',
    component: AddAcademicTermPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAcademicTermPageRoutingModule {}

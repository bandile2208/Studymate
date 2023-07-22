import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAcademicTermPageRoutingModule } from './add-academic-term-routing.module';

import { AddAcademicTermPage } from './add-academic-term.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAcademicTermPageRoutingModule
  ],
  declarations: [AddAcademicTermPage]
})
export class AddAcademicTermPageModule {}

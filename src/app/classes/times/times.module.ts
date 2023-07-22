import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimesPageRoutingModule } from './times-routing.module';

import { TimesPage } from './times.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimesPageRoutingModule
  ],
  declarations: [TimesPage]
})
export class TimesPageModule {}

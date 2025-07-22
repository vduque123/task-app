import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditTaskPageRoutingModule } from './add-edit-task-routing.module';

import { AddEditTaskPage } from './add-edit-task.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditTaskPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddEditTaskPage]
})
export class AddEditTaskPageModule {}

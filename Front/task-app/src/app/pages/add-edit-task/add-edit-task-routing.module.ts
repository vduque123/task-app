import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditTaskPage } from './add-edit-task.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditTaskPageRoutingModule {}

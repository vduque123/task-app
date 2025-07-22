import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskCreate } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-edit-task',
  standalone: false,
  templateUrl: './add-edit-task.page.html',
  styleUrls: ['./add-edit-task.page.scss'],
})
export class AddEditTaskPage implements OnInit {
  @Input() task?: Task;
  form!: FormGroup;

  priorities = [
    { label: 'Alto', value: 1 },
    { label: 'Media', value: 2 },
    { label: 'Baja', value: 3 },
    ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TaskService,
    private readonly modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      priority: [this.task?.priority || 3, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  save() {
    if (this.form.invalid) return;

    const data = this.form.value;
    if (this.task) {
      this.taskService
        .update(this.task.id, { ...data })
        .subscribe(() => this.modalCtrl.dismiss(true));
    } else {
      const newTask: TaskCreate = {
        ...data,
        status: 1,
      };
      this.taskService.create(newTask).subscribe(() => this.modalCtrl.dismiss(true));
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}

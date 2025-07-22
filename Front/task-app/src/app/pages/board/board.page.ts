import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AddEditTaskPage } from '../add-edit-task/add-edit-task.page';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  standalone: false,
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {
  tasks: Task[] = [];
  statuses = [
    { label: 'To-Do', value: 1 },
    { label: 'Doing', value: 2 },
    { label: 'Done', value: 3 },
  ];
  priorities = [
    { label: 'Alta', value: 1 },
    { label: 'Media', value: 2 },
    { label: 'Baja', value: 3 },
  ];
  connectedDropLists: string[] = [];

  constructor(
    private readonly taskService: TaskService,
    private readonly modalCtrl: ModalController,
    private readonly alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadTasks();
  this.connectedDropLists = this.statuses.map(s => `cdk-drop-${s.value}`);
  }

  loadTasks() {
    this.taskService.getAll().subscribe((res) => (this.tasks = res));
  }

  getPriorityName(id:number){
  return this.priorities.find(x=>x.value===id)?.label;
  
  }

  getTasksByStatus(status: number): Task[] {
    return this.tasks.filter((t) => t.status === status);
  }

  async openModal(task?: Task) {
    const modal = await this.modalCtrl.create({
      component: AddEditTaskPage,
      componentProps: { task },
    });
    modal.onDidDismiss().then(() => this.loadTasks());
    await modal.present();
  }

  async confirmDelete(task: Task) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.taskService.delete(task.id).subscribe(() => this.loadTasks());
          },
        },
      ],
    });
    await alert.present();
  }

onDrop(event: CdkDragDrop<Task[]>, newStatus: number) {
  const task = event.item.data as Task;
  if (task.status !== newStatus) {
    this.taskService.update(task.id, { status: newStatus }).subscribe(() => {
      this.loadTasks();
    });
  }
}
}

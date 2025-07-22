import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditTaskPage } from './add-edit-task.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('AddEditTaskPage', () => {
  let component: AddEditTaskPage;
  let fixture: ComponentFixture<AddEditTaskPage>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  const mockTask = {
    id: 1,
    title: 'Mock Task',
    priority: 3,
    status: 1,
  };

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['create', 'update']);
    const modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [AddEditTaskPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ModalController, useValue: modalSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditTaskPage);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    modalCtrlSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
  });

  it('should create the form with default values when no task is passed', () => {
    component.ngOnInit();
    expect(component.form).toBeDefined();
    expect(component.form.get('title')?.value).toBe('');
    expect(component.form.get('priority')?.value).toBe(3);
  });

  it('should initialize the form with task data when editing', () => {
    component.task = mockTask;
    component.ngOnInit();
    expect(component.form.get('title')?.value).toBe('Mock Task');
    expect(component.form.get('priority')?.value).toBe(3);
  });

  it('should call create() when saving a new task', () => {
    component.task = undefined;
    component.ngOnInit();
    component.form.setValue({ title: 'New Task', priority: 2 });

    taskServiceSpy.create.and.returnValue(of({ id: 10, title: 'New Task', priority: 2, status: 1 }));

    component.save();

    expect(taskServiceSpy.create).toHaveBeenCalledWith({
      title: 'New Task',
      priority: 2,
      status: 1,
    });
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith(true);
  });

  it('should call update() when saving an existing task', () => {
    component.task = mockTask;
    component.ngOnInit();
    component.form.setValue({ title: 'Updated Task', priority: 1 });

    taskServiceSpy.update.and.returnValue(of(undefined));

    component.save();

    expect(taskServiceSpy.update).toHaveBeenCalledWith(mockTask.id, {
      title: 'Updated Task',
      priority: 1,
    });
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith(true);
  });

  it('should not submit if form is invalid', () => {
    component.ngOnInit();
    component.form.setValue({ title: '', priority: null });

    component.save();

    expect(taskServiceSpy.create).not.toHaveBeenCalled();
    expect(taskServiceSpy.update).not.toHaveBeenCalled();
    expect(modalCtrlSpy.dismiss).not.toHaveBeenCalled();
  });

  it('should dismiss modal on close()', () => {
    component.close();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
  });
});

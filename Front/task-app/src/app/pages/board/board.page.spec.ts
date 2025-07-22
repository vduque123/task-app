import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardPage } from './board.page';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BoardPage', () => {
  let component: BoardPage;
  let fixture: ComponentFixture<BoardPage>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;

  const mockTasks = [
    { id: 1, title: 'Test 1', status: 1, priority: 3 },
    { id: 2, title: 'Test 2', status: 2, priority: 2 },
  ];

beforeEach(async () => {
  const taskSpy = jasmine.createSpyObj('TaskService', ['getAll', 'update', 'delete']);
  const modalSpy = jasmine.createSpyObj('ModalController', ['create']);
  const alertSpy = jasmine.createSpyObj('AlertController', ['create']);

  // Setup para getAll
  taskSpy.getAll.and.returnValue(of(mockTasks));

  await TestBed.configureTestingModule({
    declarations: [BoardPage],
    imports: [IonicModule.forRoot()],
    providers: [
      { provide: TaskService, useValue: taskSpy },
      { provide: ModalController, useValue: modalSpy },
      { provide: AlertController, useValue: alertSpy }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  }).compileComponents();

  fixture = TestBed.createComponent(BoardPage);
  component = fixture.componentInstance;

  // ✅ Ejecuta ngOnInit manualmente
  fixture.detectChanges();

  taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  modalCtrlSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
  alertCtrlSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
});



it('should load tasks on init', () => {
  expect(taskServiceSpy.getAll).toHaveBeenCalled();
  expect(component.tasks.length).toBe(2);
});

  it('should filter tasks by status', () => {
    component.tasks = mockTasks;
    const toDo = component.getTasksByStatus(1);
    expect(toDo.length).toBe(1);
    expect(toDo[0].title).toBe('Test 1');
  });

  it('should update task status on drop', () => {
    const eventMock = { item: { data: mockTasks[0] } };
    taskServiceSpy.update.and.returnValue(of(undefined));

    component.onDrop(eventMock as any, 2);

    expect(taskServiceSpy.update).toHaveBeenCalledWith(1, { status: 2 });
  });

  it('should open the modal on openModal()', async () => {
    modalCtrlSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      onDidDismiss: () => Promise.resolve({}),
    } as any));

    await component.openModal(mockTasks[0]);
    expect(modalCtrlSpy.create).toHaveBeenCalled();
  });

  it('should confirm and delete a task', async () => {
    const deleteHandler = jasmine.createSpy('handler');
    alertCtrlSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      buttons: [{ text: 'Delete', handler: deleteHandler }],
    } as any));

    await component.confirmDelete(mockTasks[0]);
    expect(alertCtrlSpy.create).toHaveBeenCalled();
  });
});

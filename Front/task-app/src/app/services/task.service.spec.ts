import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://localhost:7288/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Test', status: 1, priority: 3 },
    ];

    service.getAll().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Test');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create a task', () => {
    const newTask = { title: 'New Task', status: 1, priority: 2 };
    const createdTask: Task = { id: 2, ...newTask };

    service.create(newTask).subscribe(task => {
      expect(task.id).toBe(2);
      expect(task.title).toBe('New Task');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(createdTask);
  });

  it('should update a task', () => {
  const updatedData = { title: 'Updated' };

  service.update(1, updatedData).subscribe(res => {
    expect(res).toBeNull(); // 👈 usar null aquí
  });

  const req = httpMock.expectOne(`${apiUrl}/1`);
  expect(req.request.method).toBe('PUT');
  req.flush(null); // 👈 usar null aquí
});

it('should delete a task', () => {
  service.delete(1).subscribe(res => {
    expect(res).toBeNull(); // 👈 usar null aquí
  });

  const req = httpMock.expectOne(`${apiUrl}/1`);
  expect(req.request.method).toBe('DELETE');
  req.flush(null); // 👈 usar null aquí
});

});

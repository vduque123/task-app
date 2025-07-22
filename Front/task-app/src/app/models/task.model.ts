export interface Task {
  id: number;
  title: string;
  status: number;
  priority: number;
}

export interface TaskCreate {
  title: string;
  status: number;
  priority: number;
}

export interface TaskUpdate {
  title?: string;
  status?: number;
  priority?: number;
}

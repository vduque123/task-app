namespace TaskService.Repository.Interfaces;

public interface ITaskRepository
{
    IEnumerable<Entities.Task> GetAll();
    Task<Entities.Task> Add(Entities.Task task);
    
    Task<TaskService.Entities.Task?> GetById(int id);
    Task<bool> Update(TaskService.Entities.Task task);
    Task<bool> Delete(int id);
}

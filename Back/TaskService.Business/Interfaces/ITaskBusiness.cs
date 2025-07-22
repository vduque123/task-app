using TaskService.Entities;

namespace TaskService.Business.Interfaces;

public interface ITaskBusiness
{
    IEnumerable<Entities.Task> GetAllTasks();
    Task<Entities.Task> CreateTask(Entities.Task task);
    Task<bool> UpdateTask(int id, TaskUpdateModel task);
    Task<bool> DeleteTask(int id);
}
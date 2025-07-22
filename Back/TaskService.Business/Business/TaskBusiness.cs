using TaskService.Business.Interfaces;
using TaskService.Entities;
using TaskService.Repository.Interfaces;

namespace TaskService.Business.Business;

public class TaskBusiness: ITaskBusiness
{
    private readonly ITaskRepository _taskRepository;
    
    public TaskBusiness(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    
    public IEnumerable<Entities.Task> GetAllTasks()
    {
        return _taskRepository.GetAll();
    }

    public async Task<Entities.Task> CreateTask(Entities.Task task)
    {
        return await _taskRepository.Add(task);
    }

    public async Task<bool> UpdateTask(int id, TaskUpdateModel task)
    {
        var existing = await _taskRepository.GetById(id);
        if (existing == null) return false;
        
        if (task.Title != null)
            existing.Title = task.Title;

        if (task.Priority.HasValue)
            existing.Priority = task.Priority.Value;
        
        if (task.Status.HasValue)
            existing.Status = task.Status.Value;
        
        return await _taskRepository.Update(existing);
    }

    public Task<bool> DeleteTask(int id)
    {
        return _taskRepository.Delete(id);
    }
}
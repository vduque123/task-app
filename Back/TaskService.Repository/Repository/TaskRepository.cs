using Microsoft.EntityFrameworkCore;
using TaskService.Repository.Connection;
using TaskService.Repository.Interfaces;

namespace TaskService.Repository.Repository;

public class TaskRepository: ITaskRepository
{
    private readonly TaskDbContext _context;
    
    public TaskRepository(TaskDbContext context)
    {
        _context = context;
    }
    
    public IEnumerable<Entities.Task> GetAll()
    {
        return _context.Tasks.AsNoTracking().ToList();
    }

    public async Task<Entities.Task> Add(Entities.Task task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }
    
    public async Task<TaskService.Entities.Task?> GetById(int id)
    {
        return await _context.Tasks.FindAsync(id);
    }

    public async Task<bool> Update(TaskService.Entities.Task task)
    {
        var existing = await _context.Tasks.FindAsync(task.Id);
        if (existing == null)
            return false;

        existing.Title = task.Title;
        existing.Status = task.Status;
        existing.Priority = task.Priority;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }
}
using Microsoft.EntityFrameworkCore;
using Task = TaskService.Entities.Task;

namespace TaskService.Repository.Connection;

public class TaskDbContext(DbContextOptions<TaskDbContext> options) : DbContext(options)
{
    public DbSet<Task> Tasks => Set<Task>();
}
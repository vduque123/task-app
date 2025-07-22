namespace TaskService.Entities;

public class Task
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Status { get; set; } = 1;
    public int Priority { get; set; } = 3;
}

public class TaskUpdateModel
{
    public string? Title { get; set; }
    public int? Status { get; set; }
    public int? Priority { get; set; }
}
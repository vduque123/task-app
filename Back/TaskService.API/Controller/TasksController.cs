using Microsoft.AspNetCore.Mvc;
using TaskService.API.Models;
using TaskService.Business.Interfaces;
using TaskService.Entities;

namespace TaskService.API.Controller;

[ApiController]
[Route("tasks")]
public class TasksController(ITaskBusiness taskService) : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Entities.Task>> GetAll()
    {
        var tasks = taskService.GetAllTasks();
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<Entities.Task>> Create([FromBody] TaskRequest request)
    {
        var task = new Entities.Task
        {
            Title = request.Title,
            Status = request.Status,
            Priority = request.Priority,
        };
        var created = await taskService.CreateTask(task);
        return Ok(created);
    }
    
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TaskRequestUpdate request)
    {
        var data = new TaskUpdateModel
        {
            Title = request.Title,
            Priority = request.Priority,
            Status = request.Status,
        };
        
        var success = await taskService.UpdateTask(id, data);
        if (!success)
            return StatusCode(500, "Error updating task");

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await taskService.DeleteTask(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
using Moq;
using TaskService.Entities;
using TaskService.Repository.Interfaces;
using Task = System.Threading.Tasks.Task;

namespace TaskService.Tests;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _mockRepo;
    private readonly TaskService.Business.Business.TaskBusiness _service;

    
    public TaskServiceTests()
    {
        _mockRepo = new Mock<ITaskRepository>();
        _service = new TaskService.Business.Business.TaskBusiness(_mockRepo.Object);
    }
    
    [Fact]
    public void GetAllTasks_ReturnsAllTasks()
    {
        var tasks = new List<Entities.Task>
        {
            new Entities.Task { Id = 1, Title = "Test 1", Priority = 1, Status = 1 },
            new Entities.Task { Id = 2, Title = "Test 2", Priority = 2, Status = 2 },
        };
        _mockRepo.Setup(r => r.GetAll()).Returns(tasks);
        var result = _service.GetAllTasks();
        Assert.Equal(2, result.Count());
    }
    
    [Fact]
        public async Task CreateTask_ShouldReturnCreatedTask()
        {
            var newTask = new Entities.Task { Title = "Test Task", Priority = 1, Status = 1 };
            var savedTask = new Entities.Task { Id = 1, Title = "Test Task", Priority = 1, Status = 2 };

            _mockRepo.Setup(r => r.Add(newTask)).ReturnsAsync(savedTask);
            var result = await _service.CreateTask(newTask);

            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("Test Task", result.Title);
        }

        [Fact]
        public async Task UpdateTask_ShouldUpdateFieldsAndReturnTrue()
        {
            const int taskId = 1;

            var existingTask = new Entities.Task
            {
                Id = taskId,
                Title = "Old Title",
                Priority = 2,
                Status = 1
            };

            var updateModel = new TaskUpdateModel
            {
                Title = "Updated Title",
                Priority = 1,
                Status = 2
            };

            _mockRepo.Setup(r => r.GetById(taskId)).ReturnsAsync(existingTask);
            _mockRepo.Setup(r => r.Update(It.IsAny<Entities.Task>())).ReturnsAsync(true);

            var result = await _service.UpdateTask(taskId, updateModel);

            Assert.True(result);
            _mockRepo.Verify(r => r.Update(It.Is<Entities.Task>(t =>
                t.Title == "Updated Title" &&
                t.Priority == 1 &&
                t.Status == 2
            )), Times.Once);
        }

        [Fact]
        public async Task UpdateTask_ShouldReturnFalse_WhenTaskNotFound()
        {
            const int taskId = 999;
            _mockRepo.Setup(r => r.GetById(taskId)).ReturnsAsync((Entities.Task?)null);

            var updateModel = new TaskUpdateModel
            {
                Title = "No task"
            };

            var result = await _service.UpdateTask(taskId, updateModel);
            Assert.False(result);
            _mockRepo.Verify(r => r.Update(It.IsAny<Entities.Task>()), Times.Never);
        }
    
    [Fact]
    public async Task DeleteTask_ReturnsTrueIfDeleted()
    {
        _mockRepo.Setup(r => r.Delete(1)).ReturnsAsync(true);

        var result = await _service.DeleteTask(1);

        Assert.True(result);
    }
}
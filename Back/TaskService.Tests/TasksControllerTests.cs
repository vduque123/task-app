using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskService.API.Controller;
using TaskService.API.Models;
using TaskService.Business.Interfaces;
using TaskService.Entities;
using Task = System.Threading.Tasks.Task;

namespace TaskService.Tests;

public class TasksControllerTests
    {
        private readonly Mock<ITaskBusiness> _mockService;
        private readonly TasksController _controller;

        public TasksControllerTests()
        {
            _mockService = new Mock<ITaskBusiness>();
            _controller = new TasksController(_mockService.Object);
        }

        [Fact]
        public void GetAll_ShouldReturnOkWithTasks()
        {
            var tasks = new List<Entities.Task>
            {
                new() { Id = 1, Title = "Test 1", Status = 1, Priority = 1 }
            };
            _mockService.Setup(s => s.GetAllTasks()).Returns(tasks);

            var result = _controller.GetAll();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnTasks = Assert.IsType<IEnumerable<Entities.Task>>(okResult.Value, exactMatch: false);
            Assert.Single(returnTasks);
        }

        [Fact]
        public async Task Create_ShouldReturnCreatedTask()
        {
            var request = new TaskRequest
            {
                Title = "New task",
                Status = 1,
                Priority = 2
            };

            var created = new Entities.Task
            {
                Id = 1,
                Title = request.Title,
                Status = request.Status,
                Priority = request.Priority
            };

            _mockService.Setup(s => s.CreateTask(It.IsAny<Entities.Task>())).ReturnsAsync(created);

            var result = await _controller.Create(request);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var task = Assert.IsType<Entities.Task>(okResult.Value);
            Assert.Equal(1, task.Id);
            Assert.Equal("New task", task.Title);
        }

        [Fact]
        public async Task Update_ShouldReturnNoContentOnSuccess()
        {
            const int taskId = 1;
            var request = new TaskRequestUpdate
            {
                Title = "Updated",
                Priority = 5,
                Status = 1
            };

            _mockService.Setup(s => s.UpdateTask(taskId, It.IsAny<TaskUpdateModel>())).ReturnsAsync(true);
            var result = await _controller.Update(taskId, request);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_ShouldReturn500OnFailure()
        {
            const int taskId = 1;
            var request = new TaskRequestUpdate { Title = "Fails" };
            _mockService.Setup(s => s.UpdateTask(taskId, It.IsAny<TaskUpdateModel>())).ReturnsAsync(false);
            var result = await _controller.Update(taskId, request);
            var status = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, status.StatusCode);
        }

        [Fact]
        public async Task Delete_ShouldReturnNoContentWhenSuccessful()
        {
            _mockService.Setup(s => s.DeleteTask(1)).ReturnsAsync(true);
            var result = await _controller.Delete(1);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ShouldReturnNotFoundWhenNotSuccessful()
        {
            _mockService.Setup(s => s.DeleteTask(999)).ReturnsAsync(false);
            var result = await _controller.Delete(999);
            Assert.IsType<NotFoundResult>(result);
        }
    }
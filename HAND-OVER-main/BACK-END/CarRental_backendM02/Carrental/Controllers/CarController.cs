using Carrental.Dtos.RequestDTO;
using Carrental.IsServices;
using Carrental.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Carrental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly Icarservice _carservice;

        public CarController(Icarservice carservice)
        {
            _carservice = carservice;
        }

        [HttpPost("Addcar")]
        public async Task<IActionResult> Addcar([FromForm] carrequestDTO request)
        {
            var result = await _carservice.AddCarAsync(request);
            return Ok(result);
        }

        [HttpPut("{carid}")]
        public async Task<IActionResult> Editcar(Guid carid, [FromForm] carrequestDTO carrequest)
        {
            var updatedcar = await _carservice.EditCar(carid, carrequest);
            if (updatedcar == null) return NotFound();

            return Ok(updatedcar);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> Getcar(Guid id)
        {
            var result = await _carservice.GetCarByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpGet("Allcars")]
        public async Task<IActionResult> GetAllCars()
        {
            var result = await _carservice.GetAllCars();
            return Ok(result);
        }


        [HttpDelete("DeletecarId/{carId}")]
        public async Task<IActionResult> Deletecar(Guid carId)
        {
            var isDeleted = await _carservice.DeleteCarAsync(carId);
            if (!isDeleted) return NotFound();

            return NoContent();
        }


    }
}



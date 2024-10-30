
using Carrental.Dtos.RequestDTO;
using Carrental.Dtos.ResponceDTO;
using Carrental.Entities;


namespace Carrental.IRepositories
{
    public interface ICarRepository
    {
        Task<Car> AddCar(Car car);
        Task<Car> GetCarById(Guid carId);
        Task<Car> EditCar(Car car);
        Task<Car> DeleteCar(Guid carId);
        Task<List<Car>> GetAllCars();
    }
}

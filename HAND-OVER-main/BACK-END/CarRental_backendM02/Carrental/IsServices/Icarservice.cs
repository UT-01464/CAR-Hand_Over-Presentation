using Carrental.Dtos.RequestDTO;
using Carrental.Dtos.ResponceDTO;
using System.Threading.Tasks;


namespace Carrental.IsServices
{
    public interface Icarservice
    {

        Task<carresponseDTO> AddCarAsync(carrequestDTO carrequestDTO);
        Task<carresponseDTO> GetCarByIdAsync(Guid carId);
        Task<carresponseDTO> EditCar(Guid carid, carrequestDTO carRequest);
        Task<bool> DeleteCarAsync(Guid carId);
        Task<List<carresponseDTO>> GetAllCars();


    }
}
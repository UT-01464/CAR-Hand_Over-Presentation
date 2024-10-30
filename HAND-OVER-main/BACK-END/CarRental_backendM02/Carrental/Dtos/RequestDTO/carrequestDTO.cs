namespace Carrental.Dtos.RequestDTO
{
    public class carrequestDTO
    {
        public string Title { get; set; }
        public string Regnumber { get; set; }
        public string Brand { get; set; }
        public string Description { get; set; }
        public string Model { get; set; }
        public IFormFile ImageFile { get; set; }
    }
}



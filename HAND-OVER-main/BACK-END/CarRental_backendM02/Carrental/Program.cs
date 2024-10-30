using Carrental.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Carrental.IRepositries;
using Carrental.IsServices;
using Carrental.Repositoies;
using Carrental.Helpers;
using System.IO;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Carrental.IRepositories;

namespace Carrental
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.WebHost.UseWebRoot("wwwroot");
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();





            var connectionString = builder.Configuration.GetConnectionString("CarConnection");
            builder.Services.AddScoped<ICarRepository>(provider => new Carrepository(connectionString));
            builder.Services.AddScoped<Icarservice, Carservice>();

            builder.Services.AddScoped<ICustomerRepository>(provider => new CustomerRepository(connectionString));
            builder.Services.AddScoped<ICustomerService, CustomerService>();

            builder.Services.AddScoped<IManagerRepository>(provider => new ManagerRepository(connectionString));
            builder.Services.AddScoped<IManagerService, ManagerService>();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });


            var app = builder.Build();


            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseRouting();

            app.UseCors();

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseAuthorization();


            app.MapControllers();



            app.Run();
        }
    }
}

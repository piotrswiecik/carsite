using MongoDB.Driver;
using MongoDB.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

app.UseAuthorization();

app.MapControllers();

await DB.InitAsync("BidDb",
    MongoClientSettings.FromConnectionString(builder.Configuration.GetConnectionString("BidDbConnetion")));

app.Run();


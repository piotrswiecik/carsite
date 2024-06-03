using AuctionService.Consumers;
using AuctionService.Data;
using AuctionService.RequestHelpers;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AuctionDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// autodetect mapping profiles in current assembly
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddMassTransit(opt =>
{
    opt.AddEntityFrameworkOutbox<AuctionDbContext>(o =>
    {
        o.QueryDelay = TimeSpan.FromSeconds(10);
        o.UsePostgres();
        o.UseBusOutbox();
    });
    
    opt.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();
    opt.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));
    
    opt.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.ConfigureEndpoints(ctx);
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.Authority = builder.Configuration["IdentityService:Authority"];
        opt.RequireHttpsMetadata = false;
        opt.TokenValidationParameters.ValidateAudience = false;
        opt.TokenValidationParameters.NameClaimType = "username";
    });

var app = builder.Build();

app.UseAuthentication(); // middleware init order is important
app.UseAuthorization();

app.MapControllers();

try
{
    DbInitializer.InitDb(app);
}
catch (Exception e)
{
    Console.WriteLine(e.Message);
}

app.Run();

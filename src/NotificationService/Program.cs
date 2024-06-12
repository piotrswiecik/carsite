using MassTransit;
using NotificationService.Consumers;
using NotificationService.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMassTransit(opt =>
{
    opt.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
    opt.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("nt", false));
    opt.UsingRabbitMq((context, config) =>
    {
        config.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest")!);
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest")!);
        });
        config.ConfigureEndpoints(context);
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<NotificationHub>("/notifications");

app.Run();

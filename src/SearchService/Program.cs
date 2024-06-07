using System.Net;
using MassTransit;
using Polly;
using Polly.Extensions.Http;
using SearchService.Consumers;
using SearchService.Data;
using SearchService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddHttpClient<AuctionServiceHttpClient>().AddPolicyHandler(GetPolicy());

builder.Services.AddMassTransit(opt =>
{
    // mass transit registers consumers
    // for each consumer<t> amqp broker will create a topology
    // in case of rabbitmq 2 exchanges and 1 queue will be created
    // in this case:
    // Contracts:AuctionCreated exchange
    // search-auction-created exchange
    // and search-auction-created queue
    opt.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
    
    opt.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));
    
    // here we point to specific amqp implementation
    opt.UsingRabbitMq((ctx, cfg) =>
    {
        // mass transit creates consumer endpoints and registers topology with rabbitmq
        // cfg.ConfigureEndpoints(ctx);
        
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });
        
        // refactored into per-endpoint configuration instead
        cfg.ReceiveEndpoint("search-auction-created", e =>
        {
            // when exception is thrown by consumer, normally it causes message to be dropped to error queue
            // here we state that we want to retry 5 times before dropping
            e.UseMessageRetry(r => r.Interval(5, 5));
            e.ConfigureConsumer<AuctionCreatedConsumer>(ctx);
        });
        
        cfg.ReceiveEndpoint("search-auction-updated", e =>
        {
            e.UseMessageRetry(r => r.Interval(5, 5));
            e.ConfigureConsumer<AuctionUpdatedConsumer>(ctx);
        });
        
        cfg.ReceiveEndpoint("search-auction-deleted", e =>
        {
            e.UseMessageRetry(r => r.Interval(5, 5));
            e.ConfigureConsumer<AuctionDeletedConsumer>(ctx);
        });
        
        cfg.ReceiveEndpoint("search-auction-finished", e =>
        {
            e.UseMessageRetry(r => r.Interval(5, 5));
            e.ConfigureConsumer<AuctionFinishedConsumer>(ctx);
        });
        
        cfg.ReceiveEndpoint("search-bid-placed", e =>
        {
            e.UseMessageRetry(r => r.Interval(5, 5));
            e.ConfigureConsumer<BidPlacedConsumer>(ctx);
        });
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Lifetime.ApplicationStarted.Register(async () =>
{
    try
    {
        Console.WriteLine("Firing ApplicationStarted callback");
        await DbInitializer.InitDb(app);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
});

app.Run();


static IAsyncPolicy<HttpResponseMessage> GetPolicy()
    => HttpPolicyExtensions
        .HandleTransientHttpError()
        .OrResult(m => m.StatusCode == HttpStatusCode.NotFound)
        .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionCreatedConsumer(IHubContext<NotificationHub> hubContext) : IConsumer<AuctionCreated>
{

    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("--> Auction created message received");

        // method name allows listening clients to identify the message they are interested in
        await hubContext.Clients.All.SendAsync("AuctionCreated", context.Message);
    }
}
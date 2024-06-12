using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionFinishedConsumer(IHubContext<NotificationHub> hubContext) : IConsumer<AuctionFinished>
{
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        Console.WriteLine("--> Auction finished message received");

        // method name allows listening clients to identify the message they are interested in
        await hubContext.Clients.All.SendAsync("AuctionFinished", context.Message);
    }
}
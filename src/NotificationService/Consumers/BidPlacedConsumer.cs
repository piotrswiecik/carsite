using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class BidPlacedConsumer(IHubContext<NotificationHub> hubContext) : IConsumer<BidPlaced>
{
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("--> Bid placed message received");

        // method name allows listening clients to identify the message they are interested in
        await hubContext.Clients.All.SendAsync("BidPlaced", context.Message);
    }
}
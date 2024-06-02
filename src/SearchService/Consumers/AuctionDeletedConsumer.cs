using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionDeletedConsumer : IConsumer<AuctionDeleted>
{
    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
        Console.WriteLine("--> Consuming auction deleted event" + context.Message.Id);

        var item = await DB.Find<Item>().Match(i => i.ID == context.Message.Id).ExecuteFirstAsync();

        if (item == null)
        {
            throw new ArgumentException("Item not found");
        }

        await item.DeleteAsync();

    }
    
}
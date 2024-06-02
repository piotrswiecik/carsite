using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        Console.WriteLine("--> Consuming auction updated event" + context.Message.Id);

        // check if updated item exists
        var item = await DB.Find<Item>().Match(i => i.ID == context.Message.Id.ToString()).ExecuteFirstAsync();
        
        // item not found - throw exception and then what?
        // message will be pushed to error queue
        // and then the auction service needs to do something about it
        if (item == null)
        {
            throw new ArgumentException("Item not found");
        }
        
        // do the update
        item.Make = context.Message.Make ?? item.Make;
        item.Model = context.Message.Model ?? item.Model;
        item.Year = context.Message.Year ?? item.Year;
        item.Color = context.Message.Color ?? item.Color;
        item.Mileage = context.Message.Mileage ?? item.Mileage;
        item.ImageUrl = context.Message.ImageUrl ?? item.ImageUrl;
        
        // commit
        await item.SaveAsync();
        
    }
}
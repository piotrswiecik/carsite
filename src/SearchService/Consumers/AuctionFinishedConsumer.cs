using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        var auction = await DB.Find<Item>().OneAsync(context.Message.AuctionId);
        
        if (auction == null)
        {
            throw new ArgumentException("Auction not found");
        }

        if (context.Message.ItemSold)
        {
            if (context.Message.Amount == null)
            {
                throw new ArgumentException("Amount must be provided if item is sold");
            }
            auction.Winner = context.Message.Winner;
            auction.SoldAmount = (int)context.Message.Amount;
        }

        auction.Status = "Finished";

        await auction.SaveAsync();
    }
}
using AuctionService.Data;
using AuctionService.Models;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionFinishedConsumer(AuctionDbContext dbContext) : IConsumer<AuctionFinished>
{
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        Console.WriteLine("Consuming auction finished");
        var auction = await dbContext.Auctions.FindAsync(context.Message.AuctionId);

        if (auction == null)
        {
            throw new ArgumentException("Auction not found");
        }

        if (context.Message.ItemSold)
        {
            auction.Winner = context.Message.Winner;
            auction.SoldAmount = context.Message.Amount;
        }

        auction.Status = auction.SoldAmount > auction.ReservePrice
            ? Status.Finished
            : Status.ReserveNotMet;

        await dbContext.SaveChangesAsync();
    }
}
using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class BidPlacedConsumer(AuctionDbContext dbContext) : IConsumer<BidPlaced>
{
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("Consuming bid placed");
        var guid = Guid.Parse(context.Message.AuctionId);
        var auction = await dbContext.Auctions.FindAsync(guid);

        if (auction == null)
        {
            throw new ArgumentException("Auction not found");
        }

        if (auction.CurrentHighBid == null
            || context.Message.BidStatus.Contains("Accepted")
            && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
        }

        await dbContext.SaveChangesAsync();
    }
}
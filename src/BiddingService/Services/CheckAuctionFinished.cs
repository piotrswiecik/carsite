using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Services;

public class CheckAuctionFinished : BackgroundService
{
    private readonly ILogger<CheckAuctionFinished> _logger;
    private readonly IServiceProvider _services;

    // we're not injecting mass transit publish endpoint directly
    // why?
    // because masstransit service lifetime is scoped - and we are inside a singleton service
    public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider services)
    {
        _logger = logger;
        _services = services;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting check for finished auctions");

        // this will trigger when StopAsync is called on the service by something external
        stoppingToken.Register(() => _logger.LogInformation("Auction check is stopping"));

        // this will keep running every 5 seconds until the service is stopped
        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuctions(stoppingToken);
            await Task.Delay(5000, stoppingToken);
        }
    }

    private async Task CheckAuctions(CancellationToken stoppingToken)
    {
        var finishedAuctions = await DB.Find<Auction>()
            .Match(a => a.AuctionEnd <= DateTime.UtcNow)
            .Match(a => !a.Finished)
            .ExecuteAsync(stoppingToken);

        if (finishedAuctions.Count == 0) return;
        
        _logger.LogInformation("Found {count} finished auctions", finishedAuctions.Count);
        
        // create scope and get IPublishEndpoint
        using var scope = _services.CreateScope();
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        // process all auctions not yet marked as finished
        foreach (var item in finishedAuctions)
        {
            // update status
            item.Finished = true;
            await item.SaveAsync(null, stoppingToken);

            // verify if there is a winning accepted bid
            var winningBid = await DB.Find<Bid>()
                .Match(b => b.AuctionId == item.ID)
                .Match(b => b.BidStatus == BidStatus.Accepted)
                .Sort(b => b.Descending(bid => bid.Amount))
                .ExecuteFirstAsync(stoppingToken);
            
            // notify service bus that auction has finished
            await endpoint.Publish(new AuctionFinished
            {
                ItemSold = winningBid != null,
                AuctionId = item.ID,
                Winner = winningBid?.Bidder,
                Seller = item.Seller,
                Amount = winningBid?.Amount
            }, stoppingToken);
        }
    }
}
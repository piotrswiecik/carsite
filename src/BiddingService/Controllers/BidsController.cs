using BiddingService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Bid>> PlaceBid(string auctionId, int amount)
    {
        // get auction from mongo
        var auction = await DB.Find<Auction>().OneAsync(auctionId);

        // there is a possibility that auction is not found
        // it could be because auction does not exist
        // but also there is a possibility of inconsistency between auction and bid service
        if (auction == null)
        {
            // TODO: check with auction svc if that has auction
            return NotFound();
        }

        // you can't bid on your own auction
        // Authorize attribute will make sure that user is authenticated
        // so we can use User.Identity.Name to get the username - and it should be null safe
        if (auction.Seller == User?.Identity?.Name)
        {
            return BadRequest("You cannot bid on your own auction");
        }

        // create a new bid instance
        var bid = new Bid()
        {
            Amount = amount,
            AuctionId = auctionId,
            Bidder = User?.Identity?.Name
        };

        // it's possible that auction has ended while user was placing bid
        if (auction.AuctionEnd < DateTime.UtcNow)
        {
            bid.BidStatus = BidStatus.Finished;
        }
        else
        {
            // find the highest bid for this auction
            var highBid = await DB.Find<Bid>()
                .Match(item => item.AuctionId == auctionId)
                .Sort(item => item.Descending(i => i.Amount))
                .ExecuteFirstAsync();

            if (highBid != null && amount > highBid.Amount || highBid == null)
            {
                bid.BidStatus = amount > auction.ReservePrice ? BidStatus.Accepted : BidStatus.AcceptedBelowReserve;
            }

            if (highBid != null && bid.Amount <= highBid.Amount)
            {
                bid.BidStatus = BidStatus.TooLow;
            }
        }

        await DB.SaveAsync(bid);

        return Ok(bid);
    }

    [HttpGet("{auctionId}")]
    public async Task<ActionResult<List<Bid>>> GetBidsForAuction(string auctionId)
    {
        var bids = await DB.Find<Bid>()
            .Match(item => item.AuctionId == auctionId)
            .Sort(item => item.Descending(b => b.BidTime))
            .ExecuteAsync();

        return bids;
    }
}
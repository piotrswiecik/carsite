using System.Globalization;
using AuctionService.Data;
using AuctionService.Models;
using Grpc.Core;
using Status = Grpc.Core.Status;

namespace AuctionService.Services;

public class GrpcAuctionService(AuctionDbContext context) : GrpcAuction.GrpcAuctionBase
{
    private readonly AuctionDbContext _dbContext = context;

    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {
        Console.WriteLine("==> Received Grpc request for auction");

        var auction = await _dbContext.FindAsync<Auction>(Guid.Parse(request.Id));

        if (auction == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, "Not found"));
        }

        var response = new GrpcAuctionResponse
        {
            Auction = new GrpcAuctionModel
            {
                AuctionEnd = auction.AuctionEnd.ToString(CultureInfo.InvariantCulture),
                Id = auction.Id.ToString(),
                ReservePrice = auction.ReservePrice,
                Seller = auction.Seller
            }
        };

        return response;
    }
}
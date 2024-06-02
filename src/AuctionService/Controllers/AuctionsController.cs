using System.Security.Cryptography;
using AuctionService.Data;
using AuctionService.DTO;
using AuctionService.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

// Q: how does di container know which kind of publish endpoint to inject?
[ApiController]
[Route("api/auctions")]
public class AuctionsController(
    AuctionDbContext ctx, IMapper mapper, IPublishEndpoint publishEndpoint) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions([FromQuery] string date)
    {
        var query = ctx.Auctions
            .OrderBy(x => x.Item.Make)
            .AsQueryable();

        if (!string.IsNullOrEmpty(date))
        {
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        }

        return await query.ProjectTo<AuctionDto>(mapper.ConfigurationProvider).ToListAsync();

    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await ctx.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null)
        {
            return NotFound();
        }

        return mapper.Map<AuctionDto>(auction);
    }
    
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto dto)
    {
        // map auction from request body dto to db entity type
        var auction = mapper.Map<Auction>(dto);
        
        // TODO: add current user as seller to auction entity
        
        // transaction starts here when entity is added to db context in memory
        // because ValueGeneratedOnAdd() is set on Id property, id is generated here instantly
        ctx.Auctions.Add(auction);
        
        // remap auction entity (already with guid assigned by database) to dto format used by amqp exchange
        var newAuction = mapper.Map<AuctionDto>(auction);

        // publish message to rabbitmq exchange
        await publishEndpoint.Publish(mapper.Map<AuctionCreated>(newAuction));
        
        // transaction ends here - atomic block
        // if amqp publish failed in previous step, database transaction is rolled back
        // otherwise auction is saved to db and other services will be eventually consistent
        var result = await ctx.SaveChangesAsync() > 0;

        if (!result)
        {
            return BadRequest("Could not save changes.");
        }

        return CreatedAtAction(nameof(GetAuctionById), new { id = auction.Id }, newAuction);
    }
    
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto dto)
    {
        var auction = await ctx.Auctions.Include(auction => auction.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null)
        {
            return NotFound();
        }
        
        // TODO: seller name must match username

        auction.Item.Make = dto.Make ?? auction.Item.Make;
        auction.Item.Model = dto.Model ?? auction.Item.Model;
        auction.Item.Color = dto.Color ?? auction.Item.Color;
        auction.Item.Mileage = dto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = dto.Year ?? auction.Item.Year;
        
        // publish update info to amqp
        // if anyone is interested in this event, they will be notified
        // if not - then nothing happens, even no topology is created
        await publishEndpoint.Publish(mapper.Map<AuctionUpdated>(auction));

        // entity is tracked so just save it
        var result = await ctx.SaveChangesAsync() > 0;

        if (!result)
        {
            return BadRequest("Could not update.");
        }

        return Ok();
    }
    
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await ctx.Auctions.FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null)
        {
            return NotFound();
        }

        ctx.Auctions.Remove(auction);
        var result = await ctx.SaveChangesAsync() > 0;

        if (!result)
        {
            return BadRequest("Could not delete.");
        }

        return Ok();
    }
    
}
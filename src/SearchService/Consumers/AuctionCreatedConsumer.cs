using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

// class naming is important - mass transit is convention based
// noted that consumer is a generic interface - so consumer is always typed for specific msg format
public class AuctionCreatedConsumer(IMapper mapper) : IConsumer<AuctionCreated>
{
    // mass transit will create a container and call this method when a message is received
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("--> Consuming auction created event" + context.Message.Id);

        var item = mapper.Map<Item>(context.Message);
        
        // this will time out and throw an exception if the db is not available
        // but the amqp message will be lost in error queue
        // to handle this, configure retry policy in mass transit elsewhere
        await item.SaveAsync();
    }
}
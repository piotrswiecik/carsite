using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<AuctionCreated>>
{
    public async Task Consume(ConsumeContext<Fault<AuctionCreated>> context)
    {
        Console.WriteLine("Consuming fault from rabbitmq");

        var exception = context.Message.Exceptions.First();
        
        if (exception.ExceptionType == "System.ArgumentException")
        {
            Console.WriteLine("Handling argument exception");
            context.Message.Message.Model = "Bar";
            await context.Publish(context.Message.Message);
        }
        else
        {
            Console.WriteLine("Some other exception occurred");
        }
    }
}
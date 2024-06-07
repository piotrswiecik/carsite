using System.Collections;
using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.Services;

namespace SearchService.Data;

public class DbInitializer
{
    public static async Task InitDb(WebApplication app)
    {
        Console.WriteLine("Running InitDb...");
        try
        {
            await DB.InitAsync("SearchDb", MongoClientSettings.FromConnectionString(
                app.Configuration.GetConnectionString("MongoDB")));

            await DB.Index<Item>()
                .Key(x => x.Make, KeyType.Text)
                .Key(x => x.Model, KeyType.Text)
                .Key(x => x.Color, KeyType.Text)
                .CreateAsync();
            
            Console.WriteLine("Database structure initialized.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }

        using var scope = app.Services.CreateScope();
        
        Console.WriteLine("Created scope");

        var client = scope.ServiceProvider.GetRequiredService<AuctionServiceHttpClient>();

        Console.WriteLine("Created client from scope");

        var items = await client.GetItemsForSearchDb();
        
        Console.WriteLine("Obtained items from API.");
        
        Console.WriteLine("Items updated sync.");
        Console.WriteLine("Items: " + items.Count);

        if (items.Count > 0)
        {
            await DB.SaveAsync(items);
        }

        // if (count == 0)
        // {
        //     Console.WriteLine("Seeding database...");
        //
        //     var itemData = await File.ReadAllTextAsync("Data/auctions.json");
        //
        //     var items = JsonSerializer.Deserialize<List<Item>>(itemData, new JsonSerializerOptions
        //     {
        //         PropertyNameCaseInsensitive = true
        //     });
        //
        //     await DB.SaveAsync(items);
        //
        // }
    }
}
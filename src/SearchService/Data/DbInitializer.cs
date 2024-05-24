using System.Collections;
using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Data;

public class DbInitializer
{
    public static async Task InitDb(WebApplication app)
    {
        try
        {
            await DB.InitAsync("SearchDb", MongoClientSettings.FromConnectionString(
                app.Configuration.GetConnectionString("MongoDB")));

            await DB.Index<Item>()
                .Key(x => x.Make, KeyType.Text)
                .Key(x => x.Model, KeyType.Text)
                .Key(x => x.Color, KeyType.Text)
                .CreateAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }

        var count = await DB.CountAsync<Item>();
        
        if (count == 0)
        {
            Console.WriteLine("Seeding database...");

            var itemData = await File.ReadAllTextAsync("Data/auctions.json");

            var items = JsonSerializer.Deserialize<List<Item>>(itemData, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            await DB.SaveAsync(items);

        }
    }
}
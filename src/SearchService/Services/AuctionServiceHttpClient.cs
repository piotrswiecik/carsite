using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Services;

public class AuctionServiceHttpClient(HttpClient client, IConfiguration configuration)
{
    public async Task<List<Item>> GetItemsForSearchDb()
    {
        // date of latest updated auction in search service mongo db
        var lastUpdated = await DB.Find<Item, string>()
            .Sort(x => x.Descending(d => d.UpdatedAt))
            // ReSharper disable once SpecifyACultureInStringConversionExplicitly
            .Project(x => x.UpdatedAt.ToString())
            .ExecuteFirstAsync();

        return await client.GetFromJsonAsync<List<Item>>(
            configuration["AuctionServiceUrl"] + "/api/auctions?date=" + lastUpdated);
    }
}
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

        // TODO: create correct settings json for docker setup - this is a workaround
        return await client.GetFromJsonAsync<List<Item>>(
            "http://auction-svc/api/auctions?date=" + lastUpdated);
    }
}
using AuctionService.DTO;
using AuctionService.Models;
using AutoMapper;

namespace AuctionService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // map auction to auction dto an follow item relationship too
        CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.Item);
        
        // tell automapper how to handle item relation from previous mapping
        CreateMap<Item, AuctionDto>();
        
        // map create auction dto to auction
        // when mapping "item" member of auction, use data from create auction dto - it already contains all the data we need
        CreateMap<CreateAuctionDto, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));

        CreateMap<CreateAuctionDto, Item>();
    }
}
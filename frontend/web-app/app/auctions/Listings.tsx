"use client";

import AuctionCard from "@/app/auctions/AuctionCard";
import AppPagination from "@/app/components/AppPagination";
import {useEffect, useState} from "react";
import {Auction, PagedResult} from "@/types";
import {getData} from "@/app/actions/auctionActions";
import Filters from "@/app/auctions/Filters";
import {useParamsStore} from "@/hooks/useParamsStore";
import {shallow} from "zustand/shallow";
import qs from "query-string";


export default function Listings() {
    const [data, setData] = useState<PagedResult<Auction>>();
    
    // TODO: update to non-deprecated method
    // this hook is used to get the current state of the store
    // but we ensure that only required properties are returned
    const params = useParamsStore(state => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        searchTerm: state.searchTerm
    }), shallow);
    
    const setParams = useParamsStore(state => state.setParams);
    
    // this helper will convert params retrieved from the store to a query string used for backend call
    const url = qs.stringifyUrl({url: "", query: params});
    
    // set new pageNumber in store
    function setPageNumber(pageNumber: number) {
        setParams({pageNumber});
    }

    // run once on initial page load + on page number change
    useEffect(() => {
        getData(url).then(data => {
            setData(data);
        });
    }, [url]);
    
    if (!data) {
        return <h3>Loading...</h3>
    }
    
    return (
        <>
            <Filters />
            <div className="grid grid-cols-4 gap-6">
                {data.results.map((auction) => (
                    <AuctionCard auction={auction} key={auction.id}/>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <AppPagination currentPage={params.pageNumber} pageCount={data.pageCount} pageChanged={setPageNumber}/>
            </div>
        </>

    );
}
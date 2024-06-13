"use client";

import {User} from "next-auth";
import {Auction, Bid} from "@/types";
import {useBidStore} from "@/hooks/useBidStore";
import {useEffect, useState} from "react";
import {getBidsForAuction} from "@/app/actions/auctionActions";
import toast from "react-hot-toast";
import Heading from "@/app/components/Heading";
import BidItem from "@/app/auctions/details/[id]/BidItem";
import {numberWithCommas} from "@/lib/numberWithComma";
import EmptyFilter from "@/app/components/EmptyFilter";
import BidForm from "@/app/auctions/details/[id]/BidForm";

type Props = {
    user: User | null;
    auction: Auction;
};

export default function BidList({user, auction}: Props) {
    const bids = useBidStore(state => state.bids);
    const setBids = useBidStore(state => state.setBids);
    const [loading, setLoading] = useState(true);
    const highBid = bids.reduce((prev, current) => (
        prev > current.amount ? prev : current.amount), 0);

    useEffect(() => {
        getBidsForAuction(auction.id)
            .then((bids: any) => {
                if (bids.error) {
                    throw bids.error;
                }
                setBids(bids as Bid[]);
            })
            .catch((error) => toast.error(error.message))
            .finally(() => setLoading(false));
    }, [auction.id, setLoading, setBids]);

    if (loading) return <span>Loading...</span>

    return (
        <div className="rounded-lg shadow-md">
            <div className="py-2 px-4 bg-white">
                <div className="sticky top-0 bg-white p-2">
                    <Heading title={`Current high bid is ${numberWithCommas(highBid)}`} subtitle=""/>
                </div>
            </div>
            <div className="overflow-auto h-[400px] flex flex-col-reverse px-2">
                {bids.length === 0 ? (
                    <EmptyFilter title="No bids for this item" subtitle="Be the first to bid!"/>
                ) : (
                    <>{bids.map(bid => (
                        <BidItem key={bid.id} bid={bid}/>
                    ))}
                    </>
                )
                }
            </div>
            <div className="px-2 pb-2 text-gray-500">
                {!user ? (
                    <div className="flex items-center justify-center p-2 text-lg font-semibold">
                        Please login to place a bid
                    </div>
                ) : user && user.username === auction.seller ? (
                    <div className="flex items-center justify-center p-2 text-lg font-semibold">
                        You cannot bid on your own item
                    </div>
                ) : (
                    <BidForm auctionId={auction.id} highBid={highBid}/>
                )}
            </div>

        </div>
    );
}
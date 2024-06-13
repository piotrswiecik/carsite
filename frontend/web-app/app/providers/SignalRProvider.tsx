"use client";

import React, {useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useAuctionStore} from "@/hooks/useAuctionStore";
import {useBidStore} from "@/hooks/useBidStore";
import {Auction, AuctionFinished, Bid} from "@/types";
import {User} from "next-auth";
import toast from "react-hot-toast";
import AuctionCreatedToast from "@/app/components/AuctionCreatedToast";
import {getDetailedViewData} from "@/app/actions/auctionActions";
import AuctionFinishedToast from "@/app/components/AuctionFinishedToast";

type Props = {
    children: React.ReactNode;
    user: User | null;
};

export default function SignalRProvider({children, user}: Props) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
    const addBid = useBidStore((state) => state.addBid);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(process.env.NEXT_PUBLIC_NOTIFY_URL!)
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log("Connected to notifications hub");
                    // listen to "BidPlaced" SignalR events
                    connection.on("BidPlaced", (bid: Bid) => {
                        console.log("BidPlaced event received");
                        if (bid.bidStatus.includes("Accepted")) {
                            setCurrentPrice(bid.auctionId, bid.amount);
                        }
                        // this requires to check for double bids inside bid store!
                        addBid(bid);
                    });

                    // listen to "AuctionCreated" SignalR events
                    connection.on("AuctionCreated", (auction: Auction) => {
                        if (user?.username !== auction.seller) {
                            return toast(<AuctionCreatedToast auction={auction}/>, {duration: 10000});
                        }
                    });

                    // listen to "AuctionFinished" SignalR events
                    connection.on("AuctionFinished", (finishedAuction: AuctionFinished) => {
                        const auction = getDetailedViewData(finishedAuction.auctionId);
                        return toast.promise(auction, {
                            loading: "Loading",
                            success: (auction) => <AuctionFinishedToast auction={auction}
                                                                        finishedAuction={finishedAuction}/>,
                            error: (error) => `Auction finished!`
                        }, {success: {duration: 10000, icon: null}});
                    });
                })
                .catch(error => console.error(error));
        }

        return () => {
            connection?.stop();
        }
    }, [connection, setCurrentPrice]);

    return (children);
}
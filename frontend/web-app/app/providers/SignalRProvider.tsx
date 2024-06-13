"use client";

import React, {useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useAuctionStore} from "@/hooks/useAuctionStore";
import {useBidStore} from "@/hooks/useBidStore";
import {Bid} from "@/types";

type Props = {
  children: React.ReactNode;  
};

export default function SignalRProvider({children}: Props) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
    const addBid = useBidStore((state) => state.addBid);
    
    useEffect(() => {
      const newConnection = new HubConnectionBuilder()
          .withUrl("http://localhost:6001/notifications")
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
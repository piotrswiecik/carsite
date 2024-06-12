import {Bid} from "@/types";
import cn from "classnames";
import {format} from "date-fns";

type Props = {
    bid: Bid;
};

export default function BidItem({bid}: Props) {
    function getBidInfo() {
        let bgColor = "";
        let text = "";
        switch (bid.bidStatus) {
            case "Accepted":
                bgColor = "bg-green-200";
                text = "Bid accepted";
                break;
            case "AcceptedBelowReserve":
                bgColor = "bg-amber-500";
                text = "Reserve not met";
                break;
            case "TooLow":
                bgColor = "bg-red-200";
                text = "Bid too low";
                break;
            default:
                bgColor = "bg-red-200";
                text = "Bid placed after auction finished";
        }
        return {bgColor, text};
    }
    
    return (
        <div className={cn(
            "border-gray-300 border-2 px-3 py-2 rounded-lg flex justify-between items-center mb-2",
            getBidInfo().bgColor
        )}>
            <div className="flex flex-col ">
                <span>Bidder: {bid.bidder}</span>
                <span className="text-gray-700 text-sm">Time: {format(bid.bidTime, "dd MMM yyyy h:mm a")}</span>
            </div>
            <div className="flex flex-col text-right">
                <div className="text-xl font-semibold">${bid.amount}</div>
                <div className="flex flex-row items-center">
                    <span>{getBidInfo().text}</span>
                </div>
            </div>
        </div>
    );
}
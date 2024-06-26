"use client";

import Countdown, {zeroPad} from "react-countdown";
import cn from "classnames";
import {useBidStore} from "@/hooks/useBidStore";
import {usePathname} from "next/navigation";

type Props = {
    auctionEnd: string
};

const renderer = ({days, hours, minutes, seconds, completed}: {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    completed: boolean
}) => {

    return (
        <div className={
            cn(
                "min-w-24 text-xs border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center",
                completed ? "bg-red-600" : (days === 0 && hours < 10) ? "bg-amber-600" : "bg-green-600"
            )
        }>
            {completed ? (
                <span>Auction finished</span>
            ) : (
                // this will cause hydration warnings because content changes every second
                <span suppressHydrationWarning={true}>
                        {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
                    </span>
            )}
        </div>
    );
}

export default function CountdownTimer({auctionEnd}: Props) {
    const open = useBidStore((state) => state.open);
    const setOpen = useBidStore((state) => state.setOpen);
    const pathname = usePathname();

    function auctionFinished() {
        if (pathname.startsWith(`/auctions/details`)) {
            setOpen(false);
        }
    }
    
    return (
        <div>
            <Countdown date={auctionEnd} renderer={renderer} onComplete={auctionFinished}/>
        </div>
    );

}
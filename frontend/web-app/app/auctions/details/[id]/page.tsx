import {getDetailedViewData} from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import CountdownTimer from "@/app/auctions/CountdownTimer";
import CardImage from "@/app/auctions/CardImage";
import DetailedSpecs from "@/app/auctions/details/[id]/DetailedSpecs";

export default async function Details({params}: {params: {id: string}}) {
    const data = await getDetailedViewData(params.id);
    
    return (
        <div>
            <div className="flex justify-between">
                <Heading title={`${data.make} ${data.model}`} subtitle="" />
                <div className="flex gap-3 items-center">
                    <h3 className="text-2xl font-semibold">Time remaining: </h3>
                    <CountdownTimer auctionEnd={data.auctionEnd} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-3">
                <div className="w-full bg-gray-200 aspect-h-10 aspect-w-16 rounded-lg overflow-hidden">
                    <CardImage imageUrl={data.imageUrl} />  
                </div>
                <div className="border-2 rounded-lg p-2 bg-gray-100">
                    <Heading title="Bids" subtitle="" />
                </div>
            </div>
            <div className="mt-3 grid grid-cols-1 rounded-lg">
                <DetailedSpecs auction={data} />
            </div>
        </div>
    );
}
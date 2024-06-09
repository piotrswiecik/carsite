"use client";

import {AiOutlineCar} from "react-icons/ai";
import {useParamsStore} from "@/hooks/useParamsStore";
import {usePathname, useRouter} from "next/navigation";

export default function Logo() {
    const reset = useParamsStore(state => state.reset);
    const router = useRouter();
    const pathName = usePathname();
    
    function doReset() {
        if (pathName !== "/") {
            router.push("/");
        }
        reset();
    }
    
    return (
        <div 
            className="flex items-center gap-2 text-3xl font-semibold text-red-400 cursor-pointer"
            onClick={doReset}
        >
            <AiOutlineCar size={35} />
            <div>MicroCarSite auctions</div>
        </div>
    );
}
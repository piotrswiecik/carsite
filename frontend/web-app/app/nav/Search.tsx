"use client";

import {FaSearch} from "react-icons/fa";
import cn from "classnames";
import {useState} from "react";
import {useParamsStore} from "@/hooks/useParamsStore";
import {usePathname, useRouter} from "next/navigation";

export default function Search() {
    const searchInputValue = useParamsStore((state) => state.searchInputValue);
    const setSearchInputValue  = useParamsStore((state) => state.setSearchInputValue);
    const setParams = useParamsStore((state) => state.setParams);
    const router = useRouter();
    const pathname = usePathname();
    
    function onChange(event: any) {
        setSearchInputValue(event.target.value);
    }
    
    function search() {
        if (pathname !== "/") {
            router.push("/")
        }
        setParams({searchTerm: searchInputValue});
    }
    
    return (
        <div className="flex items-center border-2 rounded-full py-2 shadow-sm">
            <input 
                type="text" 
                placeholder="Search for cars by make, model, color"
                value={searchInputValue}
                className={cn(
                    "input-custom text-sm text-gray-600"
                )}
                onChange={onChange}
                onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <button>
                <FaSearch 
                    size={34} 
                    className="bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2"
                    onClick={search}
                />
            </button>
        </div>
    );
}
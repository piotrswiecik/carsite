"use client";

import {FaSearch} from "react-icons/fa";
import cn from "classnames";
import {useState} from "react";
import {useParamsStore} from "@/hooks/useParamsStore";

export default function Search() {
    const [value, setValue] = useState("");
    const setParams = useParamsStore((state) => state.setParams);
    
    function onChange(event: any) {
        setValue(event.target.value);
    }
    
    function search() {
        setParams({searchTerm: value});
    }
    
    return (
        <div className="flex items-center border-2 rounded-full py-2 shadow-sm">
            <input 
                type="text" 
                placeholder="Search for cars by make, model, color"
                className={cn(
                    "flex-grow pl-5 bg-transparent focus:outline-none border-transparent focus:border-transparent",
                    "focus:ring-0 text-sm text-gray-600"
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
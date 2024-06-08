"use client";

import Image from "next/image";
import cn from "classnames";
import {useState} from "react";

type Props = {
    imageUrl: string;
};

export default function CardImage({ imageUrl }: Props) {
    const [isLoading, setLoading] = useState(true);
    
    return (
        <Image
            src={imageUrl}
            alt="image"
            fill
            priority // Load image as soon as possible - no lazy loading
            className={cn(
                "object-cover",
                "group-hover:opacity-75",
                "duration-300",
                "ease-in-out",
                isLoading ? "grayscale blur-md scale-110" : "grayscale-0 blur-0 opacity-100 scale-100"
            )}
            onLoadingComplete={() => setLoading(false)}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"  // Responsive image sizes for optimal performance
        />
    );
}
"use client";

import Image from "next/image";

type Props = {
    imageUrl: string;
};

export default function CardImage({ imageUrl }: Props) {
    return (
        <Image
            src={imageUrl}
            alt="image"
            fill
            priority // Load image as soon as possible - no lazy loading
            className="object-cover hover:opacity-70"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"  // Responsive image sizes for optimal performance
        />
    );
}
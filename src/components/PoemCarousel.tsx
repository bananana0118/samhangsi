"use client"; // This component uses hooks

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Timestamp } from "firebase/firestore"; // Import Timestamp if needed for type definition

// Define the Poem type (consider moving to a shared types file later)
interface Poem {
    id: string;
    topic: string;
    lines: string[];
    createdAt: Timestamp; // Or Date, depending on how you handle it
}

interface PoemCarouselProps {
    poems: Poem[];
}

export const PoemCarousel: React.FC<PoemCarouselProps> = ({ poems }) => {
    // Initialize Embla Carousel with the Autoplay plugin
    // Stop autoplay on interaction.
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 4000, stopOnInteraction: true }),
    ]);

    if (!poems || poems.length === 0) {
        // Optional: Render a placeholder or nothing if no poems exist
        return (
            <div className="text-center text-gray-500 py-4">
                아직 등록된 삼행시가 없어요. 첫 주자가 되어보세요!
            </div>
        );
    }

    return (
        <div className="overflow-hidden mb-12" ref={emblaRef}>
            <div className="flex">
                {/* Map through poems to create slides */}
                {poems.map((poem) => (
                    <div
                        className="flex-grow-0 flex-shrink-0 basis-4/5 md:basis-3/4 lg:basis-2/3 min-w-0 px-2"
                        key={poem.id}
                    >
                        {/* Individual Poem Card */}
                        <div className="card h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold mb-3 text-orange-600">
                                    {poem.topic}
                                </h3>
                                <div className="space-y-1 text-gray-800 text-sm sm:text-base">
                                    {poem.lines.map((line, index) => (
                                        <p key={index}>
                                            <span className="font-semibold text-orange-500 mr-2">
                                                {poem.topic[index]}:
                                            </span>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            {/* Optional: Add timestamp or other info if needed */}
                            {/* <p className="text-xs text-gray-400 mt-3 text-right">...</p> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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
    // 캐러셀 옵션 설정
    const options = {
        loop: true,
        align: "start" as const,
        dragFree: true,
    };

    // Initialize Embla Carousel with the Autoplay plugin
    const [emblaRef] = useEmblaCarousel(options, [
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
        <div className="overflow-hidden w-full mb-6 mx-0" ref={emblaRef}>
            <div className="flex pb-4">
                {/* Map through poems to create slides */}
                {poems.map((poem) => (
                    <div
                        className="flex-grow-0 flex-shrink-0 min-w-0 pl-2 pr-3 pb-3"
                        style={{ width: "320px" }}
                        key={poem.id}
                    >
                        {/* Individual Poem Card */}
                        <div className="h-full min-h-[220px] flex flex-col justify-between bg-orange-50 rounded-xl border border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            {/* 카드 헤더 */}
                            <div className="p-3 border-b border-orange-200 bg-orange-100 text-center">
                                <div className="flex items-center justify-center space-x-2 py-1">
                                    {poem.topic.split("").map((char, i) => (
                                        <span
                                            key={i}
                                            className="font-bold text-orange-600 text-lg"
                                        >
                                            {char}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {/* 카드 내용 */}
                            <div className="p-4 flex-grow">
                                <div className="text-gray-800 text-sm sm:text-base font-cookierun">
                                    {poem.lines.map((line, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center ${
                                                index > 0 ? "mt-3" : ""
                                            }`}
                                        >
                                            <div className="w-9 h-9 bg-white border border-orange-200 rounded-md flex items-center justify-center mr-3">
                                                <span className="font-bold text-orange-600 text-base">
                                                    {poem.topic[index]}
                                                </span>
                                            </div>
                                            <span className="break-words text-base">
                                                {line}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

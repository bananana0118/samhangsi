"use client";

import { useState, useEffect } from "react";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
// Import the new carousel component
import { PoemCarousel } from "../components/PoemCarousel";

// Define a type for the poem data
interface Poem {
    id: string;
    topic: string;
    lines: string[];
    createdAt: Timestamp; // Use Firestore Timestamp type
}

export default function Home() {
    const [topic, setTopic] = useState("");
    const [lines, setLines] = useState<string[]>([]);
    // State to hold the list of poems
    const [poems, setPoems] = useState<Poem[]>([]);

    // Fetch poems from Firestore on component mount
    useEffect(() => {
        const q = query(collection(db, "poems"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const poemsData: Poem[] = [];
            querySnapshot.forEach((doc) => {
                // Explicitly cast doc.data() to ensure type safety, though direct assignment might work
                const data = doc.data();
                poemsData.push({
                    id: doc.id,
                    topic: data.topic,
                    lines: data.lines,
                    createdAt: data.createdAt, // Keep as Timestamp
                });
            });
            setPoems(poemsData);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTopic = e.target.value.trim();
        if (newTopic.length <= 6) {
            setTopic(newTopic);
            setLines(Array(newTopic.length).fill(""));
        }
    };

    const handleLineChange = (index: number, value: string) => {
        const newLines = [...lines];
        newLines[index] = value;
        setLines(newLines);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        // Prepare data to be saved
        const poemData = {
            topic: topic,
            lines: lines,
            createdAt: serverTimestamp(), // Add a server-side timestamp
        };

        try {
            // Add a new document with a generated id to the 'poems' collection
            const docRef = await addDoc(collection(db, "poems"), poemData);
            console.log("Document written with ID: ", docRef.id);

            // Reset form after successful submission
            setTopic("");
            setLines([]);
        } catch (error) {
            console.error("Error adding document: ", error);
            // Handle error appropriately (e.g., show a message to the user)
        }

        // Reset form
        setTopic("");
        setLines([]);
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-8 sm:p-16 md:p-24 gradient-bg">
            {/* Updated title: Emphasize first letter of each concept */}
            <h1 className="mb-12 flex items-baseline flex-wrap justify-center text-center space-x-1 font-cookierun">
                <span className="title-emphasis">삼</span>
                <span className="title-normal">행시로</span>
                <span className="title-emphasis ml-3">행</span>
                <span className="title-normal">복한</span>
                <span className="title-emphasis ml-3">시</span>
                <span className="title-normal">간</span>
            </h1>

            {/* === Add the Poem Carousel here === */}
            <div className="w-full max-w-lg">
                <PoemCarousel poems={poems} />
            </div>

            {/* 삼행시 입력 폼 - Add background, more padding, smoother shadow */}
            <section className="w-full max-w-lg mb-12 p-8 bg-white border border-gray-200 rounded-xl shadow-lg">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
                    새 삼행시 짓기
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="topic"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            주제어 (최대 6글자)
                        </label>
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={handleTopicChange}
                            maxLength={6}
                            required
                            className="input-field"
                            placeholder="예: 여행"
                        />
                    </div>
                    {lines.map((line, index) => (
                        <div key={index}>
                            <label
                                htmlFor={`line-${index}`}
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                <span className="font-bold text-orange-600 text-lg mr-1">
                                    {topic[index] || "_"}
                                </span>
                                {index + 1}번째 줄
                            </label>
                            <input
                                type="text"
                                id={`line-${index}`}
                                value={line}
                                onChange={(e) =>
                                    handleLineChange(index, e.target.value)
                                }
                                required
                                className="input-field"
                                placeholder={`${index + 1}번째 줄을 입력하세요`}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="btn-primary w-full focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={
                            !topic ||
                            topic.length === 0 ||
                            topic.length > 6 ||
                            lines.length !== topic.length ||
                            lines.some((l) => l.trim() === "")
                        }
                    >
                        등록하기
                    </button>
                </form>
            </section>
        </main>
    );
}

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

        // Reset form was moved inside the try block for better flow
        // setTopic('');
        // setLines([]);
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-8 sm:p-16 md:p-24 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <h1 className="text-4xl font-bold mb-12 text-gray-800">
                삼행시 광장
            </h1>

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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                            placeholder="예: 여행"
                        />
                    </div>
                    {lines.map((line, index) => (
                        <div key={index}>
                            <label
                                htmlFor={`line-${index}`}
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                <span className="font-bold text-indigo-600 text-lg mr-1">
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                                placeholder={`${index + 1}번째 줄을 입력하세요`}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
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

            {/* 삼행시 목록 */}
            <section className="w-full max-w-lg mt-8">
                <h2 className="text-3xl font-semibold mb-6 text-gray-700">
                    올라온 삼행시
                </h2>
                {/* 삼행시 목록 렌더링 */}
                <div className="space-y-6">
                    {poems.length === 0 ? (
                        <p className="text-gray-500 text-center">
                            아직 등록된 삼행시가 없습니다.
                        </p>
                    ) : (
                        poems.map((poem) => (
                            <div
                                key={poem.id}
                                className="p-6 bg-white border border-gray-200 rounded-lg shadow-md"
                            >
                                <h3 className="text-xl font-semibold mb-3 text-indigo-700">
                                    주제어: {poem.topic}
                                </h3>
                                <div className="space-y-1 text-gray-800">
                                    {poem.lines.map((line, index) => (
                                        <p key={index}>
                                            <span className="font-semibold text-indigo-500 mr-2">
                                                {poem.topic[index]}:
                                            </span>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                                {/* Optional: Display timestamp */}
                                {/* <p className="text-xs text-gray-400 mt-3 text-right">
                                    {poem.createdAt?.toDate().toLocaleString() ?? '시간 정보 없음'}
                                </p> */}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}

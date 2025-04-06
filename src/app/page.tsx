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
    getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
// Import the new carousel component
import { PoemCarousel } from "../components/PoemCarousel";
import Link from "next/link";

// Define a type for the poem data
interface Poem {
    id: string;
    topic: string;
    lines: string[];
    createdAt: Timestamp; // Use Firestore Timestamp type
}

// 주제어 타입 정의
interface Topic {
    id: string;
    word: string;
    category: string;
}

export default function Home() {
    const [topic, setTopic] = useState("");
    const [lines, setLines] = useState<string[]>([]);
    // State to hold the list of poems
    const [poems, setPoems] = useState<Poem[]>([]);
    const [lineErrors, setLineErrors] = useState<string[]>([]);
    // 주제어 목록 상태
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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

        // 주제어 목록 가져오기
        fetchTopics();

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this runs only once on mount

    // 주제어 목록 가져오기 함수
    const fetchTopics = async () => {
        try {
            const topicsSnapshot = await getDocs(collection(db, "topics"));
            const topicsData: Topic[] = [];
            topicsSnapshot.forEach((doc) => {
                const data = doc.data();
                topicsData.push({
                    id: doc.id,
                    word: data.word,
                    category: data.category || "기본",
                });
            });
            setTopics(topicsData);

            // 주제어 로드 후 자동으로 오늘의 주제어 설정
            if (topicsData.length > 0) {
                setTodaysRandomTopic(topicsData);
            }
        } catch (error) {
            console.error("주제어 가져오기 오류:", error);
        }
    };

    // 오늘 날짜 기반 랜덤 주제어 설정 함수
    const setTodaysRandomTopic = (availableTopics: Topic[]) => {
        // 봄 카테고리 주제어만 필터링
        const springTopics = availableTopics.filter(
            (topic) => topic.category === "봄"
        );

        if (springTopics.length === 0) {
            console.error("봄 관련 주제어가 없습니다.");
            return;
        }

        // 오늘 날짜를 시드로 사용
        const today = new Date();
        const dateString = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
        const seed = parseInt(dateString);

        // 시드 기반 랜덤 인덱스 생성 (단순한 방식의 시드 기반 랜덤)
        const randomIndex = seed % springTopics.length;
        const selectedTopic = springTopics[randomIndex].word;

        setTopic(selectedTopic);
        setLines(Array(selectedTopic.length).fill(""));
        setLineErrors(Array(selectedTopic.length).fill(""));
    };

    // 랜덤 주제어 선택 함수
    const selectRandomTopic = () => {
        setIsLoading(true);
        if (topics.length === 0) {
            alert("사용 가능한 주제어가 없습니다.");
            setIsLoading(false);
            return;
        }

        // 봄 카테고리 주제어만 필터링
        const springTopics = topics.filter((topic) => topic.category === "봄");

        if (springTopics.length === 0) {
            alert("봄 관련 주제어가 없습니다.");
            setIsLoading(false);
            return;
        }

        const randomIndex = Math.floor(Math.random() * springTopics.length);
        const selectedTopic = springTopics[randomIndex].word;
        setTopic(selectedTopic);
        setLines(Array(selectedTopic.length).fill(""));
        setLineErrors(Array(selectedTopic.length).fill(""));
        setIsLoading(false);
    };

    const handleLineChange = (index: number, value: string) => {
        const newLines = [...lines];
        newLines[index] = value;
        setLines(newLines);

        // 첫 글자 일치 여부 확인
        const newErrors = [...lineErrors];
        if (value.length > 0) {
            const firstChar = value.trim().charAt(0);
            const topicChar = topic[index];

            if (firstChar !== topicChar) {
                newErrors[index] = `첫 글자는 '${topicChar}'이어야 합니다`;
            } else {
                newErrors[index] = "";
            }
        } else {
            newErrors[index] = "";
        }
        setLineErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        // 모든 줄이 첫 글자 검증을 통과했는지 확인
        if (lineErrors.some((error) => error !== "")) {
            alert("각 줄의 첫 글자가 주제어의 해당 글자와 일치해야 합니다.");
            return;
        }

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
        <main className="flex min-h-screen flex-col items-center py-6 sm:py-8 gradient-bg">
            <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6">
                {/* Updated title: Emphasize first letter of each concept */}
                <h1 className="mb-6 sm:mb-8 flex items-baseline flex-wrap justify-center text-center space-x-1 font-cookierun">
                    <span className="title-emphasis text-4xl sm:text-5xl">
                        삼
                    </span>
                    <span className="title-normal text-xl sm:text-2xl">
                        행시로
                    </span>
                    <span className="title-emphasis text-4xl sm:text-5xl ml-2">
                        행
                    </span>
                    <span className="title-normal text-xl sm:text-2xl">
                        복한
                    </span>
                    <span className="title-emphasis text-4xl sm:text-5xl ml-2">
                        시
                    </span>
                    <span className="title-normal text-xl sm:text-2xl">간</span>
                </h1>

                {/* === Add the Poem Carousel here === */}
                <div className="w-full overflow-hidden mb-6">
                    <PoemCarousel poems={poems} />
                </div>

                {/* 삼행시 입력 폼 - Add background, more padding, smoother shadow */}
                <div className="flex justify-center w-full">
                    <section className="w-full max-w-[500px] mb-6 p-5 bg-white border border-orange-200 rounded-xl shadow-lg">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-orange-600">
                            오늘의 주제
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="topic"
                                    className="block text-sm font-medium text-orange-500 mb-2 text-center"
                                >
                                    {topic ? (
                                        <div className="flex items-center justify-center space-x-2 py-1 px-3 bg-orange-50 rounded-lg inline-block">
                                            {topic.split("").map((char, i) => (
                                                <span
                                                    key={i}
                                                    className="font-bold text-orange-600 text-xl"
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        "오늘의 주제어"
                                    )}
                                </label>
                                <div className="mt-2 text-center mb-4">
                                    <button
                                        type="button"
                                        onClick={selectRandomTopic}
                                        className="btn-primary px-3 py-2 border-none outline-none"
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? "로딩 중..."
                                            : "다른 주제 고르기"}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {lines.map((line, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-9 h-9 bg-orange-50 border border-orange-200 rounded-md flex items-center justify-center mr-3">
                                                    <span className="font-bold text-orange-600 text-lg">
                                                        {topic[index] || "_"}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        id={`line-${index}`}
                                                        value={line}
                                                        onChange={(e) =>
                                                            handleLineChange(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                        className={`input-field w-full outline-none focus:outline-none appearance-none py-2 ${
                                                            lineErrors[index]
                                                                ? "border-red-500"
                                                                : "border-orange-200"
                                                        }`}
                                                        style={{
                                                            outline: "none",
                                                            boxShadow:
                                                                "none !important",
                                                            WebkitAppearance:
                                                                "none",
                                                            MozAppearance:
                                                                "none",
                                                            appearance: "none",
                                                            border: lineErrors[
                                                                index
                                                            ]
                                                                ? "1px solid rgb(239, 68, 68)"
                                                                : "1px solid rgb(254, 215, 170)",
                                                        }}
                                                        placeholder="입력하세요"
                                                    />
                                                </div>
                                            </div>
                                            {lineErrors[index] && (
                                                <div className="pl-[52px] mt-1">
                                                    <p className="text-red-500 text-xs">
                                                        {lineErrors[index]}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary px-3 py-2 border-none outline-none w-full disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                                disabled={
                                    !topic ||
                                    topic.length === 0 ||
                                    topic.length > 6 ||
                                    lines.length !== topic.length ||
                                    lines.some((l) => l.trim() === "") ||
                                    lineErrors.some((error) => error !== "")
                                }
                            >
                                등록하기
                            </button>
                        </form>
                    </section>
                </div>

                {/* 관리자 페이지 링크 */}
                <div className="w-full text-center mt-6 mb-4 text-xs text-gray-500">
                    <Link
                        href="/admin"
                        className="text-gray-500 hover:text-orange-500 no-underline"
                        style={{ textDecoration: "none" }}
                    >
                        관리자 페이지
                    </Link>
                </div>
            </div>
        </main>
    );
}

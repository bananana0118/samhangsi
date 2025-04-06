"use client";

import { useState, useEffect } from "react";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import Link from "next/link";

interface Topic {
    id: string;
    word: string;
    category: string;
    createdAt?: Timestamp;
}

export default function AdminPage() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [newWord, setNewWord] = useState("");
    const [newCategory, setNewCategory] = useState("봄");
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 환경 변수에서 관리자 비밀번호 가져오기
    const ADMIN_PASSWORD =
        process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin1234";

    // 봄 관련 추천 주제어 목록
    const springSuggestions = [
        "봄바람",
        "꽃놀이",
        "새싹",
        "진달래",
        "벚꽃",
        "개나리",
    ];

    useEffect(() => {
        if (isAuthenticated) {
            fetchTopics();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            alert("비밀번호가 일치하지 않습니다.");
        }
    };

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
                    createdAt: data.createdAt,
                });
            });
            setTopics(topicsData);
        } catch (error) {
            console.error("주제어 가져오기 오류:", error);
        }
    };

    const handleAddSuggestion = async (word: string) => {
        setIsLoading(true);
        try {
            const topicData = {
                word: word,
                category: "봄",
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "topics"), topicData);
            alert(`'${word}' 주제어가 추가되었습니다.`);
            fetchTopics();
        } catch (error) {
            console.error("주제어 추가 오류:", error);
            alert("주제어 추가 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWord.trim()) {
            alert("주제어를 입력해주세요.");
            return;
        }

        if (newWord.length > 6) {
            alert("주제어는 최대 6글자까지 입력 가능합니다.");
            return;
        }

        setIsLoading(true);
        try {
            const topicData = {
                word: newWord.trim(),
                category: newCategory,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "topics"), topicData);
            setNewWord("");
            alert("주제어가 추가되었습니다.");
            fetchTopics();
        } catch (error) {
            console.error("주제어 추가 오류:", error);
            alert("주제어 추가 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTopic = async (id: string) => {
        if (!confirm("정말 이 주제어를 삭제하시겠습니까?")) {
            return;
        }

        try {
            await deleteDoc(doc(db, "topics", id));
            alert("주제어가 삭제되었습니다.");
            fetchTopics();
        } catch (error) {
            console.error("주제어 삭제 오류:", error);
            alert("주제어 삭제 중 오류가 발생했습니다.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex max-w-[1200px] min-h-screen flex-col items-center justify-center py-6 sm:py-8">
                <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
                        관리자 로그인
                    </h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 box-border"
                                style={{ boxSizing: "border-box" }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen max-w-[1200px] mx-auto flex-col items-center py-6 sm:py-8">
            <div className="w-full max-w-3xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-600">
                        주제어 관리자 페이지
                    </h1>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        메인으로 돌아가기
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-orange-600">
                        새 주제어 추가
                    </h2>
                    <form
                        onSubmit={handleAddTopic}
                        className="space-y-4 max-w-2xl mx-auto"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="word"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    주제어 (최대 6글자)
                                </label>
                                <input
                                    type="text"
                                    id="word"
                                    value={newWord}
                                    onChange={(e) => setNewWord(e.target.value)}
                                    maxLength={6}
                                    required
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 box-border"
                                    style={{ boxSizing: "border-box" }}
                                    placeholder="예: 봄꽃"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    카테고리
                                </label>
                                <select
                                    id="category"
                                    value={newCategory}
                                    onChange={(e) =>
                                        setNewCategory(e.target.value)
                                    }
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 box-border"
                                    style={{ boxSizing: "border-box" }}
                                >
                                    <option value="봄">봄</option>
                                    <option value="여름">여름</option>
                                    <option value="가을">가을</option>
                                    <option value="겨울">겨울</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? "추가 중..." : "주제어 추가"}
                        </button>
                    </form>

                    {/* 추천 주제어 목록 */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            봄 관련 추천 주제어
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {springSuggestions.map((word) => (
                                <button
                                    key={word}
                                    onClick={() => handleAddSuggestion(word)}
                                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm hover:bg-orange-200 focus:outline-none"
                                    disabled={isLoading}
                                >
                                    {word}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-orange-600">
                        주제어 목록
                    </h2>
                    {topics.length === 0 ? (
                        <p className="text-gray-500">
                            등록된 주제어가 없습니다.
                        </p>
                    ) : (
                        <div className="overflow-x-auto max-w-2xl mx-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5"
                                        >
                                            주제어
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5"
                                        >
                                            카테고리
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"
                                        >
                                            동작
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topics.map((topic) => (
                                        <tr key={topic.id}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {topic.word}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {topic.category}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        handleDeleteTopic(
                                                            topic.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

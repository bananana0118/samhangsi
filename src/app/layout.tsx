import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "삼행시로 행복한 시간",
    description: "재미있는 삼행시를 짓고 공유하세요!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable}`}>
            <body className="font-cookierun gradient-bg flex justify-center align-center">
                {children}
            </body>
        </html>
    );
}

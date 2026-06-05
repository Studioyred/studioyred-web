import type { Metadata } from "next";
import "./globals.css";
import { MusicProvider } from "./context/MusicContext";

export const metadata: Metadata = {
  title: "Studio Y Red — Where Warm Stories Are Made",
  description: "Studio Y Red is a creative studio crafting heartfelt stories through Little Groom, GCA, Miss Catherine, and more.",
  keywords: ["Studio Y Red", "Little Groom", "GCA", "Miss Catherine", "animation", "film"],
  openGraph: {
    title: "Studio Y Red",
    description: "Where Warm Stories Are Made",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Serif+KR:wght@300;400;600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <div className="grain" aria-hidden="true" />
        <MusicProvider>{children}</MusicProvider>
      </body>
    </html>
  );
}

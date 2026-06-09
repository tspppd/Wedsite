import type { Metadata } from "next";
import { Geist,  Prompt, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  weight : ["400", "500" , "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wedsite",
  description: "สร้างเว็บไซต์แต่งงานง่ายๆ ในไม่กี่นาที ด้วยเทมเพลตสวยงามและฟีเจอร์ครบครัน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, prompt.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

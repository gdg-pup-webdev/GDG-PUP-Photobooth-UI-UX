import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Using Outfit as the primary font - it's very similar to Google Sans
// and is available on Google Fonts
const googleSans = Outfit({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GDG Photobooth | Santa Doesn’t Know U Like I Do: A Design Jam",
  description: "Capture amazing photos at the Santa Doesn’t Know U Like I Do: A Design Jam!",
  openGraph: {
    title: "GDG Photobooth | Santa Doesn’t Know U Like I Do: A Design Jam",
    description: "Capture amazing photos at the Santa Doesn’t Know U Like I Do: A Design Jam!",
    images: [
      {
        url: "/sharing.webp",
        width: 1200,
        height: 630,
        alt: "GDG Photobooth | Santa Doesn’t Know U Like I Do: A Design Jam",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG Photobooth | Santa Doesn’t Know U Like I Do: A Design Jam",
    description: "Capture amazing photos at the Santa Doesn’t Know U Like I Do: A Design Jam!",
    images: ["/sharing.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${googleSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-google-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}

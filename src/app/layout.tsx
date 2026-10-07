import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins-next",
  display: "swap",
});

export const metadata: Metadata = {
  title: "F-Ferm POS",
  description: "F-Ferm POS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased font-sans">
        <Providers>
          {children} <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}

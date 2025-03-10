import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "../components/AuthContext";
import { AlertProvider } from "@/components/AlertContext";
import Backgrounds from "./(pages)/backgrounds/backgrounds";
import Footer from "./footer";
import Navbar from "./navBar";
import ClientLayout from './clientLayout'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "HI- Tech",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-svg.jpeg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AlertProvider>
            <ClientLayout>{children}</ClientLayout>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

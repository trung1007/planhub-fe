import type { Metadata } from "next";
import '@/styles/globals.css';
import Providers from "@/providers";
import Header from "@/components/layout/Header";



export const metadata: Metadata = {
  title: "PlanHub",
  description: "Manage your plans efficiently with PlanHub",
  icons: {
    icon: '/planhub-logo.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import '@/styles/globals.css';
import Providers from "@/providers";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import MainFrame from "@/components/layout/MainFrame";
import '@ant-design/compatible';


export const metadata: Metadata = {
  title: "PlanHub",
  description: "Manage your plans efficiently with PlanHub",
  icons: {
    icon: '/planhub-logo.ico'
  }
};

const originalWarn = console.warn;

console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("[antd: compatible]")
  ) {
    return; // không in cảnh báo
  }
  originalWarn(...args);
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
          <div className="h-full flex flex-col">
            <Header />
            <div className="flex-1 flex h-fit ">
              <SideBar />
              <MainFrame>
                {children}
              </MainFrame>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

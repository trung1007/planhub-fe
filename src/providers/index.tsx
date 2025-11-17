"use client";

import { ReactNode } from "react";
import ReduxProvider from "./ReduxProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import ToastProvider from "./ToastProvider";


const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <ToastProvider>{children}</ToastProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
};

export default Providers;

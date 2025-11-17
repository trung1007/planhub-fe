"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ToastProvider;

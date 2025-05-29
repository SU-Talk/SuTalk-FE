// src/components/Loader/GlobalLoader.js
import React from "react";
import { MoonLoader } from "react-spinners";
import { useLoading } from "./LoadingContext";
import "./Loader.css";

const GlobalLoader = () => {
  const { loading } = useLoading();
  return loading ? (
    <div className="loader-overlay">
      <MoonLoader color="#2670ff" size={40} />
    </div>
  ) : null;
};
export default GlobalLoader;

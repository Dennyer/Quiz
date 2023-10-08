import React from "react";
import ReactLoading from "react-loading";

const LoadingSpinner = () => (
  <div className="flex h-screen flex-col items-center justify-center space-y-4 text-3xl dark:text-white">
    <p>Loading...</p>
    <ReactLoadingWrapper />
  </div>
);

const ReactLoadingWrapper = () => {
  return (
    <div className="text-black dark:text-white">
      <ReactLoading type="bars" color="currentColor" />
    </div>
  );
};

export default LoadingSpinner;

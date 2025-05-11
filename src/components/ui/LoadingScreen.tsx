import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-800 border-t-transparent"></div>
        <h2 className="text-xl font-semibold text-blue-800">Loading...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
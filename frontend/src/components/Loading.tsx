import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loading : React.FC<{message?:string}> = ({message}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4">
        <PuffLoader color="#ffffff" size={60} />
        <p className="text-white text-lg font-semibold">{message? message : "Loading..."}</p>
      </div>
    </div>
  );
};

export default Loading;

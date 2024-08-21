"use client";
import { RotateCcw } from "lucide-react";

function index() {
  return (
    <button
      className="absolute text-white  bottom-4 right-4 bg-pink-600  w-16 h-16 rounded-full flex justify-center items-center"
      onClick={() => {
        window.location.reload();
      }}
    >
      <RotateCcw strokeWidth={3} size={30}/>
    </button>
  );
}

export default index;

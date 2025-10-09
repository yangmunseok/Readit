import React from "react";
import { Link } from "react-router-dom";

export const WelcomePage = () => {
  return (
    <div className="relative text-white overflow-hidden h-dvh lg:h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-dvh lg:h-screen w-full object-cover"
      >
        <source src="video/video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 h-dvh lg:h-screen bg-black/50"></div>
      <div className="relative h-dvh lg:h-screen flex flex-col justify-between items-center z-10">
        <p className="self-start text-start text-4xl font-semibold p-2">
          Readit
        </p>
        <div className="text-center">
          <p className="font-black text-4xl lg:text-7xl">
            도서 검색부터 책 위치 확인, 리뷰 공유까지, 한곳에서!
          </p>
          <Link
            to="/login"
            className="inline-block border p-2 lg:p-5 m-5 border-white rounded-md hover:bg-white/20"
          >
            <p className="text-2xl lg:text-4xl font-bold">시작</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

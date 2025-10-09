import React from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

export const NotFoundPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="relative font-pretendard max-w-screen overflow-x-hidden h-screen">
      <header className="flex flex-col w-full justify-evenly text-white bg-black/60 bg-[url(/img/Background2.jpg)] bg-blend-multiply bg-cover bg-center">
        <nav className="px-2 w-full h-8 lg:h-12 bg-black/10  border-b border-b-white/10">
          <div className="w-full max-w-7xl h-full flex justify-between items-center p-2 mx-auto">
            <Link to={"/"} className="font-bold font-sans text-xl lg:text-2xl">
              Readit
            </Link>
            <button
              className="text-sm lg:text-base font-pretendard hover:text-stone-200"
              onClick={user ? logout : () => navigate("/login")}
            >
              {user ? "logout" : "login"}
            </button>
          </div>
        </nav>
        <div className="flex flex-col mx-auto items-baseline gap-10 lg:gap-20 py-20 w-full max-w-7xl px-5">
          <p className="font-semibold text-3xl lg:text-5xl">
            도서 검색부터 책 위치 확인, 리뷰 공유까지, 한곳에서!
          </p>
          <form
            method="get"
            action={"/search"}
            role="search"
            className="relative w-full flex items-center"
          >
            <input
              type="text"
              name="query"
              className="w-full bg-white text-stone-600 text-base p-4"
              placeholder={"원하시는 도서를 검색해주세요"}
            />
            <button type="submit" className="absolute right-4">
              <IoIosSearch color="black" className="size-6" />
            </button>
          </form>
        </div>
      </header>
      <div className="text-center">
        <div className="mt-50">
          <p className="font-black text-3xl lg:text-8xl">404</p>
          <p className="mt-10 lg:text-2xl">
            The page you are looking for can't be found
          </p>
        </div>
      </div>
    </div>
  );
};

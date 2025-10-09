import React, { useEffect, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useLoanStore } from "../stores/useLoanStore";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useState } from "react";
import axios from "../lib/axios";
import { useAuthStore } from "../stores/useAuthStore";

export const HomePage = () => {
  const { books, isSearchingBooks, searchBooks } = useLoanStore();
  const { logout } = useAuthStore();
  const [recommendList, setRecommendList] = useState([]);
  const { user } = useAuthStore();
  const [dialog, setDialog] = useState({ start: 0, end: 0, max: 0 });
  const goBackward = () => {
    if (dialog.start > 0) {
      setDialog((prev) => ({
        start: prev.start - 1,
        end: prev.end - 1,
        max: prev.max,
      }));
    }
  };
  const goForward = () => {
    if (dialog.end < dialog.max) {
      setDialog((prev) => ({
        start: prev.start + 1,
        end: prev.end + 1,
        max: prev.max,
      }));
    }
  };
  useState(() => {
    const fetchRecommandation = async () => {
      try {
        const response = await axios.get("/book/recommendList");
        const result = response.data;
        const data = result.data;
        console.log(data);
        setRecommendList(data);
        setDialog((prev) => ({
          start: 0,
          max: data.length,
          end: data.length > 6 ? 6 : data.length,
        }));
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (books.length === 0) {
      searchBooks();
    }
    fetchRecommandation();
  }, [books]);

  if (isSearchingBooks) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative text-white font-pretendard max-w-screen overflow-x-hidden">
      <header className="flex flex-col w-full justify-evenly bg-black/60 bg-[url(/img/Background2.jpg)] bg-blend-multiply bg-cover bg-center">
        <nav className="px-2 w-full h-8 lg:h-12 bg-black/10  border-b border-b-white/10">
          <div className="w-full max-w-7xl h-full flex justify-between items-center p-2 mx-auto">
            <p className="font-bold font-sans text-xl lg:text-2xl">Readit</p>
            <button
              className="text-sm lg:text-base font-pretendard hover:text-stone-200"
              onClick={logout}
            >
              logout
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

      <div className="mt-20">
        <div className="text-black mx-auto w-full max-w-7xl p-2">
          <div className="flex w-full justify-between font-bold mb-10">
            <p className="text-2xl">도서 랭킹!</p>
            <Link
              to="/ranking"
              className="flex items-center text-lg text-stone-700"
            >
              더보기
              <FaArrowRight />
            </Link>
          </div>
          <div className="flex gap-2 lg:justify-between max-w-7xl overflow-x-scroll">
            {books.data &&
              books.data.slice(0, 6).map((book) => (
                <div>
                  <img
                    src={book.bookImageURL}
                    className="w-40 h-60 border-2 border-stone-200"
                  ></img>
                  <div className="mt-5">
                    <p className="flex items-center justify-center border border-blue-500 rounded-full w-7 h-7 text-blue-700 font-semibold">
                      {book.ranking}
                    </p>
                    <p className="font-bold text-lg w-40 mt-4">
                      {book.bookname}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="text-black mx-auto w-full max-w-7xl p-2 mt-20">
          <div className="flex w-full justify-between font-bold mb-10">
            <p className="text-2xl">
              {recommendList.length > 0
                ? `${user.nickname}님, 최근 책 위치 조회 기록을 바탕으로 좋아하실 만한 책을 추천해 드립니다.`
                : `${user.nickname}님, 책의 도서관 위치를 조회하고 맞춤 추천 도서를 바로 만나보세요!`}
            </p>
          </div>
          {recommendList.length > 0 && (
            <div className="relative flex w-full overflow-x-scroll lg:justify-between lg:overflow-visible">
              <button
                onClick={goBackward}
                className="hidden lg:flex absolute  justify-center items-center right-full top-30 translate-x-1/2 border h-10 w-10 rounded-full border-stone-300 bg-white hover:scale-110 group"
              >
                <IoIosArrowBack className="size-5 text-stone-500 group-hover:scale-110" />
              </button>
              {recommendList.map((book, index) => (
                <div
                  className={`${
                    index < dialog.start || index >= dialog.end
                      ? "lg:hidden"
                      : "lg:block"
                  }`}
                >
                  <img
                    src={book.bookImageURL}
                    className="w-40 h-60 border-2 border-stone-200"
                  ></img>
                  <div className="mt-4">
                    <p className="font-bold text-lg w-40 h-40">
                      {book.bookname}
                    </p>
                  </div>
                </div>
              ))}
              <button
                onClick={goForward}
                className="hidden lg:flex absolute justify-center items-center left-full top-30 -translate-x-1/2 border h-10 w-10 rounded-full border-stone-300 bg-white hover:scale-110 group"
              >
                <IoIosArrowForward className="size-5 text-stone-500 group-hover:scale-110" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

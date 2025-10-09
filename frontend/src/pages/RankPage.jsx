import React, { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { IoIosSearch } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useLoanStore } from "../stores/useLoanStore";

export const RankPage = () => {
  const { logout } = useAuthStore();
  const { books, isSearchingBooks, searchBooks } = useLoanStore();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const kdcStr = query.get("kdc");
  const currCategory = kdcStr === null || kdcStr === "" ? -1 : Number(kdcStr);
  const CATEGORY = [
    "전체",
    "총류",
    "철학",
    "종교",
    "사회과학",
    "자연과학",
    "기술과학",
    "예술",
    "언어",
    "문학",
    "역사",
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search.slice(1));
    searchBooks(params);
  }, [location]);

  if (isSearchingBooks) return <LoadingSpinner />;

  return (
    <div className="relative text-white font-pretendard overflow-x-hidden">
      <header className="flex flex-col w-full justify-evenly bg-black/60 bg-[url(img/Background2.jpg)] bg-blend-multiply bg-cover bg-center">
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
      <div className="mt-20 text-black w-full max-w-7xl mx-auto p-2">
        <div className="flex gap-4 lg:justify-between w-full border-b border-t border-stone-500 text-xl lg:text-2xl p-2 overflow-x-scroll lg:overflow-x-hidden">
          {CATEGORY.map((category, index) => {
            const kdc = index - 1;
            if (index === 0) {
              query.delete("kdc");
            } else {
              query.set("kdc", kdc);
            }
            if (kdc === currCategory) {
              return (
                <span className="bg-stone-900 text-white shrink-0">
                  {category}
                </span>
              );
            }
            return (
              <Link
                to={`${location.pathname}?${query.toString()}`}
                className="shrink-0"
              >
                {category}
              </Link>
            );
          })}
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-5 w-full gap-5 mt-10">
          {books.data &&
            books.data.map((book) => (
              <Link to={`/reviews/${book.isbn13}`}>
                <img
                  src={book.bookImageURL}
                  className="w-full aspect-2/3 border-2 border-stone-200"
                ></img>
                <div className="mt-5">
                  <p className="flex items-center justify-center border border-blue-500 rounded-full w-7 h-7 text-blue-700 font-semibold">
                    {book.ranking}
                  </p>
                  <span className="font-bold text-lg w-40 mt-4">
                    {book.bookname}
                  </span>
                  {book.vol && (
                    <span className="font-bold text-lg"> {book.vol}권</span>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

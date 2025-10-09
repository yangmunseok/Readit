import React, { useEffect, useState } from "react";
import { BookBox } from "../components/BookBox";
import { Link, useLocation } from "react-router-dom";
import axios from "../lib/axios";
import { IoIosSearch } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { useAuthStore } from "../stores/useAuthStore";

export const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentPage = Number(query.get("pageNo")) || 1;
  const [books, setBooks] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const pageSize = 10;
  const [minPaginationIdx, setMinPagination] = useState(1);
  const { logout } = useAuthStore();

  const handleBackward = () => {
    if (minPaginationIdx - pageSize > 0)
      setMinPagination((prev) => prev - pageSize);
  };
  const handleForward = () => {
    if (minPaginationIdx + pageSize < totalPage)
      setMinPagination((prev) => prev + pageSize);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = new URLSearchParams(location.search.slice(1));
        const response = await axios.get("/book/srchBooksNaver", { params });
        console.log(response.data);
        const { items, total } = response.data;
        setBooks(items);
        setTotalPage(Math.floor(total / pageSize));
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, [location]);
  return (
    <div className="font-pretendard bg-stone-100 overflow-x-hidden px-2">
      <div className="flex max-w-6xl mx-auto items-center justify-between py-10 lg:py-20">
        <div className="relative max-w-5xl">
          <form
            method="get"
            action={"/search"}
            role="search"
            className="relative flex w-full h-15 items-center mb-10 lg:mb-20"
          >
            <input
              type="search"
              name="query"
              className="border border-stone-200 w-full h-full p-2 text-stone-700 text-lg bg-white"
              defaultValue={query.get("query")}
            />
            <button type="submit" className="absolute right-3">
              <IoIosSearch className="size-6 text-black" />
            </button>
          </form>
          {books &&
            books.length > 0 &&
            books.map((book) => {
              return <BookBox book={book} />;
            })}
        </div>
        <button
          className="hidden lg:flex h-15 items-center gap-1 self-baseline p-2"
          onClick={logout}
        >
          <MdLogout className="size-6" />
          <p className="text-xs lg:text-sm font-medium text-stone-700">
            로그아웃
          </p>
        </button>
      </div>

      <ol className="flex justify-center py-5">
        <li className="flex text-black w-10 h-10 justify-center items-center">
          <button onClick={handleBackward}>{"<"}</button>
        </li>
        {totalPage > 0 &&
          Array(pageSize)
            .fill()
            .map((_, index) => {
              const curIdx = index + minPaginationIdx;
              if (curIdx > totalPage) return null;
              query.set("pageNo", curIdx);
              if (curIdx === currentPage)
                return (
                  <li className="flex text-blue-500 font-bold underline underline-offset-4 decoration-4 decoration-blue-500 w-10 h-10 justify-center items-center">
                    {curIdx}
                  </li>
                );
              return (
                <li
                  className="flex text-black
                  } w-10 h-10 justify-center items-center"
                >
                  <Link to={`${location.pathname}?${query.toString()}`}>
                    {curIdx}
                  </Link>
                </li>
              );
            })}
        <li className="flex text-black w-10 h-10 justify-center items-center">
          <button onClick={handleForward}>{">"}</button>
        </li>
      </ol>
    </div>
  );
};

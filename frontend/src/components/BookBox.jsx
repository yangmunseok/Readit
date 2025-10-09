import React from "react";
import he from "he";
import { Link } from "react-router-dom";
export const BookBox = ({ book }) => {
  return (
    <Link
      to={`/reviews/${book.isbn}`}
      className="flex justify-between items-center w-full gap-5 lg:gap-20 h-50 lg:h-65  border-b border-stone-500 py-5"
    >
      <div className="flex items-center shrink-0 w-30 lg:w-45 h-full">
        <img
          src={book.image ? book.image : "/img/NoImage.jpg"}
          className="h-full object-cover"
        />
      </div>

      <div className="h-full overflow-y-scroll flex flex-col lg:min-w-3xl">
        <span className="font-bold text-base lg:text-lg">{book.title}</span>
        {book.vol && (
          <span className="font-bold text-base lg:text-lg"> {book.vol}권</span>
        )}
        <p className="flex text-xs lg:text-sm text-stone-400 items-center gap-1 mt-1">
          {book.author}
          {book.author && (
            <span className="flex items-center bg-stone-300 w-1 h-1 rounded-full">
              {" "}
            </span>
          )}

          {book.publisher}
        </p>
        <p className="text-base lg:text-lg text-stone-400 mt-2">
          {book.description}
        </p>
      </div>
    </Link>
  );
};

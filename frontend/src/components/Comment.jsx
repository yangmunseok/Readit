import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { FaRegStar, FaStar } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";

export const Comment = ({ review, className = "" }) => {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReview, setCurrentReview] = useState({
    content: review.content,
    rating: review.rating,
    likes: review.likes,
  });
  const [updatedReview, setUpdatedReview] = useState({
    content: review.content,
    rating: review.rating,
    likes: review.likes,
  });
  const [like, setLike] = useState(
    user.LikedReviews.some((doc) => {
      return doc.id === review.id;
    })
  );
  const [deleted, setDeleted] = useState(false);
  const handleUpdateReview = async () => {
    try {
      await axios.patch(`/review/updateReview/${review.id}`, {
        content: updatedReview.content,
        rating: updatedReview.rating,
      });
      setCurrentReview(updatedReview);
      setIsEditing(false);
      toast.success("comment updated!");
    } catch (error) {
      toast.error("updated failed...");
    }
  };
  const handleLikeUnlikeReview = async () => {
    try {
      const response = await axios.post(
        `/review/likeUnlikeReview/${review.id}`
      );
      const newReview = {
        ...currentReview,
        likes: currentReview.likes + (like ? -1 : 1),
      };
      setUpdatedReview(newReview);
      setCurrentReview(newReview);
      setLike(!like);

      toast.success(response.data.message);
    } catch (error) {
      toast.error("like failed...");
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axios.delete(`/review/deleteReview/${review.id}`);
      toast.success("comment deleted");
      setDeleted(true);
    } catch (error) {
      toast.error("deleted failed");
    }
  };
  if (deleted) return <></>;
  if (isEditing)
    return (
      <div className={`${className} border-1`}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex gap-1 items-center">
              <img
                src="/img/avatar.png"
                className="h-10 w-10 object-cover inline-block"
              />
              <p>{user.nickname}</p>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={`lable-star-${value}`} htmlFor={`star${value}`}>
                  {value > updatedReview.rating ? (
                    <FaRegStar color="orange" size={20} />
                  ) : (
                    <FaStar color="orange" size={20} />
                  )}
                </label>
              ))}
            </div>
          </div>

          <input
            type="text"
            name="content"
            className="rounded-sm bg-stone-100 w-full h-20 outline-none"
            defaultValue={currentReview.content}
            onChange={(e) =>
              setUpdatedReview({
                ...updatedReview,
                content: e.currentTarget.value,
              })
            }
          />
          <button
            onClick={handleUpdateReview}
            className="self-end rounded-sm bg-sky-500 p-2 hover:bg-sky-400"
          >
            <p className="text-white font-bold">수정</p>
          </button>
        </div>

        <>
          {" "}
          <input
            type="radio"
            name="rating"
            id="star1"
            value={1}
            onClick={(e) =>
              setUpdatedReview({
                ...updatedReview,
                rating: e.currentTarget.value,
              })
            }
            className="hidden"
          />
          <input
            type="radio"
            name="rating"
            id="star2"
            value={2}
            onClick={(e) =>
              setUpdatedReview({
                ...updatedReview,
                rating: e.currentTarget.value,
              })
            }
            className="hidden"
          />
          <input
            type="radio"
            name="rating"
            id="star3"
            value={3}
            onClick={(e) =>
              setUpdatedReview({
                ...updatedReview,
                rating: e.currentTarget.value,
              })
            }
            className="hidden"
          />
          <input
            type="radio"
            name="rating"
            id="star4"
            value={4}
            onClick={(e) =>
              setUpdatedReview({
                ...updatedReview,
                rating: e.currentTarget.value,
              })
            }
            className="hidden"
          />
          <input
            type="radio"
            name="rating"
            id="star5"
            value={5}
            onClick={(e) =>
              setUpdatedReview({
                ...updatedReview,
                rating: e.currentTarget.value,
              })
            }
            className="hidden"
          />
        </>
      </div>
    );
  return (
    <div className={className}>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <span>
            <img
              src="/img/avatar.png"
              className="rounded-full w-15 h-15 object-cover inline-block"
            />
          </span>
          <p className="font-bold text-lg">
            Reviewed By
            <br />
            <span className="font-normal">{review.User.nickname}</span>
          </p>
        </div>

        <div className="flex">
          {[1, 2, 3, 4, 5].map((value) => {
            return value > currentReview.rating ? (
              <FaRegStar color="orange" key={`icon-star-${value}`} size={20} />
            ) : (
              <FaStar color="orange" key={`icon-star-${value}`} size={20} />
            );
          })}
        </div>
      </div>
      <p className="mt-5 text-lg wrap-anywhere">{currentReview.content}</p>
      <div className="relative flex justify-end items-center">
        <button
          onClick={handleLikeUnlikeReview}
          className={like ? "text-red-800 flex" : "text-black flex"}
        >
          {like ? (
            <AiFillLike color="red" size={20} />
          ) : (
            <AiOutlineLike color="red" size={20} />
          )}
          {currentReview.likes}
        </button>
        {review.User.nickname === user.nickname && (
          <>
            {" "}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="hover:text-stone-700"
            >
              <CiMenuKebab size={20} />
            </button>
            <div
              className={`absolute p-2 top-full right-0 border rounded-sm bg-white ${
                showMenu ? "flex flex-col" : "hidden"
              }`}
            >
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="hover:bg-stone-200"
              >
                수정
              </button>
              <button
                onClick={handleDeleteReview}
                className="hover:bg-stone-200"
              >
                삭제
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

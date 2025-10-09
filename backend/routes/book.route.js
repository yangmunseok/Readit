import express from "express";
import {
  searchBookByIsbn,
  searchLibraryByIsbn,
  searchBooks,
  bookExists,
  getRecommendedBooks,
  getPopularBooks,
  searchBooksFromNaver,
  searchBookByIsbnNaver,
} from "../controllers/book.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/srchBookByIsbn/:isbn", isLoggedIn, searchBookByIsbn);
router.get("/srchBookByIsbnNaver/:isbn", isLoggedIn, searchBookByIsbnNaver);
router.get("/srchLibByIsbn/", isLoggedIn, searchLibraryByIsbn);
router.get("/srchBooks", isLoggedIn, searchBooks);
router.get("/bookExists/", isLoggedIn, bookExists);
router.get("/recommendList", isLoggedIn, getRecommendedBooks);
router.get("/getPopularBooks", isLoggedIn, getPopularBooks);
router.get("/srchBooksNaver", isLoggedIn, searchBooksFromNaver);
export default router;

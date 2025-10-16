import { request } from "express";
import xml2js from "xml2js";
import { ENV_VARS } from "../config/envVars.js";
import { db } from "../config/db.js";

const { User } = db.models;

const key = ENV_VARS.LIBRARY_BIGDATA_API_KEY;

const NAVER_SEARCH_API_URL = "https://openapi.naver.com/v1/search/book.json";
const NAVER_DTL_SEARCH_API_URL =
  "https://openapi.naver.com/v1/search/book_adv.xml";
const NAVER_CLIENT = {
  id: ENV_VARS.NAVER_API_CLIENT_ID,
  password: ENV_VARS.NAVER_API_CLIENT_PWD,
};

export const searchBooksFromNaver = async (req, res) => {
  try {
    const pageSize = 10;
    const searchParams = new URLSearchParams(req.query);
    const pageNo = Number(searchParams.get("pageNo")) || 1;
    searchParams.delete("pageNo");
    searchParams.set("start", pageSize * pageNo - 9);
    const queryString = searchParams.toString();

    const searchResult = await fetch(`${NAVER_SEARCH_API_URL}?${queryString}`, {
      method: "GET",
      headers: {
        Content_Type: "application/json",
        "X-Naver-Client-Id": NAVER_CLIENT.id,
        "X-Naver-Client-Secret": NAVER_CLIENT.password,
      },
    });
    const json = await searchResult.json();
    res.status(200).json(json);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const searchParams = new URLSearchParams(req.query);

    searchParams.set("authKey", key);
    searchParams.set("format", "json");

    const queryString = searchParams.toString();
    const searchResult = await fetch(
      `http://data4library.kr/api/srchBooks?${queryString}`
    );
    const json = await searchResult.json();

    const data = json.response;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchBookByIsbn = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (!isbn || isbn.length !== 13) {
      return res.status(400).json({ error: "complete your parameters" });
    }

    const searchParams = new URLSearchParams({
      authKey: key,
      format: "json",
      isbn13: isbn,
    });

    const searchResult = await fetch(
      `http://data4library.kr/api/srchDtlList?${searchParams.toString()}`
    );
    const json = await searchResult.json();
    const book = json.response.detail[0].book;
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchBookByIsbnNaver = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (!isbn || isbn.length !== 13) {
      return res.status(400).json({ error: "complete your parameters" });
    }
    const searchParams = new URLSearchParams({ d_isbn: isbn, display: 1 });
    const queryString = searchParams.toString();
    const searchResult = await fetch(
      `${NAVER_DTL_SEARCH_API_URL}?${queryString}`,
      {
        method: "GET",
        headers: {
          Content_Type: "application/xml",
          "X-Naver-Client-Id": NAVER_CLIENT.id,
          "X-Naver-Client-Secret": NAVER_CLIENT.password,
        },
      }
    );
    const xml = await searchResult.text();
    const json = await xml2js.parseStringPromise(xml, { explicitArray: false });
    const item = json.rss.channel.item;
    res.status(200).json(item);

    const curUser = await User.findOne({ where: { id: req.user.id } });
    let updatedSearchHistory = [...(curUser.searchHistory || []), isbn];

    // Remove duplicated data
    updatedSearchHistory = [...new Set(updatedSearchHistory)];
    console.log("Updated search history:", updatedSearchHistory);

    if (updatedSearchHistory.length > 5) {
      updatedSearchHistory = updatedSearchHistory.slice(-5);
    }
    curUser.update({
      searchHistory: updatedSearchHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchLibraryByIsbn = async (req, res) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    searchParams.set("authKey", key);
    searchParams.set("format", "json");

    const queryString = searchParams.toString();

    if (!req.query.region || !req.query.isbn || req.query.isbn.length !== 13) {
      return res.status(400).json({ error: "invalid request" });
    }

    const searchResult = await fetch(
      `http://data4library.kr/api/libSrchByBook?${searchParams.toString()}`
    );
    const json = await searchResult.json();
    const data = json.response;
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const bookExists = async (req, res) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    searchParams.set("authKey", key);
    searchParams.set("format", "json");

    if (
      !req.query.libCode ||
      !req.query.isbn13 ||
      req.query.isbn13.length !== 13
    ) {
      return res.status(400).json({ error: "invalid request" });
    }

    const searchResult = await fetch(
      `http://data4library.kr/api/bookExist?${searchParams.toString()}`
    );
    const json = await searchResult.json();
    res.status(200).json({ data: json });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRecommendedBooks = async (req, res) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    searchParams.set("authKey", key);
    searchParams.set("format", "json");
    searchParams.set("type", "mania");
    searchParams.set("isbn13", req.user.searchHistory.join(";"));
    if (req.user.searchHistory.length < 1) {
      return res.status(400).json({ error: "invalid request" });
    }

    const searchResult = await fetch(
      `http://data4library.kr/api/recommandList?${searchParams.toString()}`
    );
    const json = await searchResult.json();
    const data = json.response;
    const result = {
      request: { ...data.request },
      resultNums: data.resultNums,
      data: data.docs.map((obj) => obj.book),
    };
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPopularBooks = async (req, res) => {
  try {
    const searchParams = new URLSearchParams(req.query);
    searchParams.set("authKey", key);
    searchParams.set("format", "json");

    const searchResult = await fetch(
      `http://data4library.kr/api/loanItemSrch?${searchParams.toString()}`
    );
    const json = await searchResult.json();
    const data = json.response;
    const result = {
      request: { ...data.request },
      data: data.docs.map((obj) => obj.doc),
    };
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

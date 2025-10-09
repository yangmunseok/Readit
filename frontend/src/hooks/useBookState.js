import { useReducer } from "react";

const reducer = (state, action) => {};
export const usePopularBook = () => {
  const [state, dispatch] = useReducer(reducer, {});
};

useEffect(() => {
  const fetchPopularBooks = async () => {
    try {
      setIsLoadingPopularBooks(true);
      const response = await axios.get("/book/getPopularBooks");
      console.log(response.data.docs);
      setPopularBooks(response.data.docs);
      setIsLoadingPopularBooks(false);
    } catch (error) {
      setIsLoadingPopularBooks(false);
      console.error(error);
    }
  };
  const fetchRecommandation = async () => {
    try {
      const response = await axios.get("/book/recommendList");
      setRecommendList(response.data.docs);
    } catch (error) {
      console.error(error);
    }
  };
  fetchPopularBooks();
  fetchRecommandation();
}, []);

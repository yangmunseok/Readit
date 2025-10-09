import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../lib/axios";
import he from "he";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";
import { Comment } from "../components/Comment";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { IoLibraryOutline } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { MdOutlinePhoneAndroid } from "react-icons/md";

export const ReviewPage = () => {
  const { isbn } = useParams();
  const [bookDetails, setBookDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  const [availableLibs, setAvailableLibs] = useState([]);
  const [review, setReview] = useState({ content: "", rating: 0 });
  const [libraries, setLibraries] = useState({});
  const { user } = useAuthStore();
  const regionSelection = useRef(null);
  const { logout } = useAuthStore();
  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(`/review/postReview`, {
        content: review.content,
        rating: review.rating,
        bookId: isbn,
      });
      console.log(response.data);
      setReviews([...reviews, response.data]);
      setReview({ content: "", rating: 0 });

      toast.success("Review submitted");
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    }
  };

  const handleLibrary = async () => {
    const regionStr = regionSelection.current.value;
    const [region, regionDtl] = regionStr.split(",");
    const response = await axios.get(`/book/srchLibByIsbn`, {
      params: { region, dtl_region: regionDtl, isbn },
    });
    console.log(response.data.libs);
    setAvailableLibs(response.data.libs);
  };
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/book/srchBookByIsbnNaver/${isbn}`);
        const data = response.data;
        console.log(data);
        setBookDetails({
          ...data,
          description: he.decode(data.description),
        });
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/review/getReviews/${isbn}`);
        const data = response.data;
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch book reviews:", error);
      }
    };
    fetchBookDetails();
    fetchReviews();
  }, []);
  console.log(bookDetails);
  return (
    <div className="flex flex-col gap-20 font-pretendard text-black bg-white items-center overflow-x-hidden">
      <div className="h-20 w-full  bg-black text-white">
        <div className="max-w-7xl h-full flex justify-between items-center mx-auto p-2">
          <Link to="/" className="font-bold text-xl lg:text-2xl">
            Readit
          </Link>
          <p className="font-medium text-md lg:text-lg">책 상세정보</p>
          <button onClick={logout} className="font-normal text-xs lg:text-sm">
            <MdLogout className="inline-block mr-1 size-6" />
            logout
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-10 justify-between p-2">
        <img
          src={bookDetails.image}
          className="lg:h-150 cover shadow-lg shadow-black"
        />
        <div className="flex flex-col gap-10 lg:max-w-2xl">
          <div className="lg:h-150 flex flex-col gap-5 lg:justify-between">
            <div className="flex flex-col gap-10 lg:max-h-107">
              <div className="flex flex-col gap-5">
                <p className="font-black text-2xl lg:text-4xl">
                  {bookDetails.title}
                </p>
                <p className="font-semibold text-lg lg:text-xl">
                  {bookDetails.author}
                </p>
              </div>
              <p className="lg:overflow-y-scroll">{bookDetails.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 border-t-2 border-t-stone-200 pt-5">
              <div className="flex justify-between">
                <p className="font-bold text-lg">출판사</p>
                <p>{bookDetails.publisher}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-lg">출판일</p>
                <p>{bookDetails.pubdate}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-lg">ISBN-13</p>
                <p>{bookDetails.isbn}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl border-t-2 border-stone-200 p-2 lg:p-0">
        <p className="font-bold text-2xl mt-5">도서를 소장한 도서관을 찾기</p>
        <div className="mt-5 mb-10">
          <p>지역 선택</p>
          <div className="w-full flex justify-between gap-5">
            <select
              name="region"
              className="outline-none border border-stone-400 flex-1 rounded-sm"
              ref={regionSelection}
            >
              <optgroup label="서울특별시">
                <option value="11,11010"> 종로구 </option>
                <option value="11,11020"> 중구 </option>
                <option value="11,11030"> 용산구 </option>
                <option value="11,11040"> 성동구 </option>
                <option value="11,11050"> 광진구 </option>
                <option value="11,11060"> 동대문구 </option>
                <option value="11,11070"> 중랑구 </option>
                <option value="11,11080"> 성북구 </option>
                <option value="11,11090"> 강북구 </option>
                <option value="11,11100"> 도봉구 </option>
                <option value="11,11110"> 노원구 </option>
                <option value="11,11120"> 은평구 </option>
                <option value="11,11130"> 서대문구 </option>
                <option value="11,11140"> 마포구 </option>
                <option value="11,11150"> 양천구 </option>
                <option value="11,11160"> 강서구 </option>
                <option value="11,11170"> 구로구 </option>
                <option value="11,11180"> 금천구</option>
                <option value="11,11190"> 영등포구 </option>
                <option value="11,11200"> 동작구 </option>
                <option value="11,11210"> 관악구 </option>
                <option value="11,11220"> 서초구 </option>
                <option value="11,11230"> 강남구 </option>
                <option value="11,11240"> 송파구 </option>
                <option value="11,11250"> 강동구</option>
              </optgroup>
              <optgroup label="부산광역시">
                <option value="21,21010"> 중구 </option>
                <option value="21,21020"> 서구 </option>
                <option value="21,21030"> 동구 </option>
                <option value="21,21040"> 영도구 </option>
                <option value="21,21050"> 부산진구 </option>
                <option value="21,21060"> 동래구 </option>
                <option value="21,21070"> 남구 </option>
                <option value="21,21080"> 북구 </option>
                <option value="21,21090"> 해운대구 </option>
                <option value="21,21100"> 사하구 </option>
                <option value="21,21110"> 금정구 </option>
                <option value="21,21120"> 강서구 </option>
                <option value="21,21130"> 연제구 </option>
                <option value="21,21140"> 수영구 </option>
                <option value="21,21150"> 사상구 </option>
                <option value="21,21310"> 기장군 </option>
              </optgroup>
              <optgroup label="대구광역시">
                <option value="22,22010"> 중구 </option>
                <option value="22,22020"> 동구 </option>
                <option value="22,22030"> 서구 </option>
                <option value="22,22040"> 남구 </option>
                <option value="22,22050"> 북구 </option>
                <option value="22,22060"> 수성구</option>
                <option value="22,22070"> 달서구</option>
                <option value="22,22310"> 달성군</option>
              </optgroup>
              <optgroup label="인천광역시">
                <option value="23,23010">중구 </option>
                <option value="23,23020">동구 </option>
                <option value="23,23030">남구 </option>
                <option value="23,23040">연수구 </option>
                <option value="23,23050">남동구 </option>
                <option value="23,23060">부평구</option>
                <option value="23,23070">계양구 </option>
                <option value="23,23080">서구 </option>
                <option value="23,23310">강화군 </option>
                <option value="23,23320">옹진군 </option>
              </optgroup>
              <optgroup label="광주광역시">
                <option value="24,24010">동구 </option>
                <option value="24,24020">서구 </option>
                <option value="24,24030">남구 </option>
                <option value="24,24040">북구 </option>
                <option value="24,24050">광산구</option>
              </optgroup>
              <optgroup label="대전광역시">
                <option value="25,25010">동구 </option>
                <option value="25,25020">중구 </option>
                <option value="25,25030">서구 </option>
                <option value="25,25040">유성구 </option>
                <option value="25,25050">대덕구 </option>
              </optgroup>
              <optgroup label="울산광역시">
                <option value="26,26010">중구 </option>
                <option value="26,26020">남구 </option>
                <option value="26,26030">동구 </option>
                <option value="26,26040">북구 </option>
                <option value="26,26310">울주군</option>
              </optgroup>
              <optgroup label="세종특별자치시">
                <option value="29,29010">세종시</option>
              </optgroup>
              <optgroup label="경기">
                <option value="31,31010">수원시 </option>
                <option value="31,31011">수원시 장안구 </option>
                <option value="31,31012">수원시 권선구 </option>
                <option value="31,31013">수원시 팔달구 </option>
                <option value="31,31014">수원시 영통구 </option>
                <option value="31,31020">성남시 </option>
                <option value="31,31021">성남시 수정구 </option>
                <option value="31,31022">성남시 중원구 </option>
                <option value="31,31023">성남시 분당구 </option>
                <option value="31,31030">의정부시 </option>
                <option value="31,31040">안양시 </option>
                <option value="31,31041">안양시 만안구 </option>
                <option value="31,31042">안양시 동안구 </option>
                <option value="31,31050">부천시 </option>
                <option value="31,31060">광명시 </option>
                <option value="31,31070">평택시 </option>
                <option value="31,31080">동두천시</option>
                <option value="31,31090">안산시 </option>
                <option value="31,31091">안산시 상록구 </option>
                <option value="31,31092">안산시 단원구 </option>
                <option value="31,31100">고양시 </option>
                <option value="31,31101">고양시 덕양구 </option>
                <option value="31,31103">고양시 일산동구 </option>
                <option value="31,31104">고양시 일산서구 </option>
                <option value="31,31110">과천시 </option>
                <option value="31,31120">구리시 </option>
                <option value="31,31130">남양주시 </option>
                <option value="31,31140">오산시 </option>
                <option value="31,31150">시흥시 </option>
                <option value="31,31160">군포시 </option>
                <option value="31,31170">의왕시 </option>
                <option value="31,31180">하남시 </option>
                <option value="31,31190">용인시 </option>
                <option value="31,31191">용인시 처인구 </option>
                <option value="31,31192">용인시 기흥구 </option>
                <option value="31,31193">용인시 수지구 </option>
                <option value="31,31200">파주시 </option>
                <option value="31,31210">이천시 </option>
                <option value="31,31220">안성시 </option>
                <option value="31,31230">김포시 </option>
                <option value="31,31240">화성시 </option>
                <option value="31,31250">광주시 </option>
                <option value="31,31260">양주시 </option>
                <option value="31,31270">포천시 </option>
                <option value="31,31280">여주시 </option>
                <option value="31,31350">연천군 </option>
                <option value="31,31370">가평군 </option>
                <option value="31,31380">양평군 </option>
              </optgroup>
              <optgroup label="강원">
                <option value="32,32010">춘천시</option>
                <option value="32,32020">원주시</option>
                <option value="32,32030">강릉시</option>
                <option value="32,32040">동해시</option>
                <option value="32,32050">태백시</option>
                <option value="32,32060">속초시</option>
                <option value="32,32070">삼척시</option>
                <option value="32,32310">홍천군</option>
                <option value="32,32320">횡성군</option>
                <option value="32,32330">영월군</option>
                <option value="32,32340">평창군</option>
                <option value="32,32350">정선군</option>
                <option value="32,32360">철원군</option>
                <option value="32,32370">화천군</option>
                <option value="32,32380">양구군</option>
                <option value="32,32390">인제군</option>
                <option value="32,32400">고성군</option>
                <option value="32,32410">양양군</option>
              </optgroup>
              <optgroup label="충북">
                <option value="33,33020">충주시 </option>
                <option value="33,33030">제천시 </option>
                <option value="33,33040">청주시 </option>
                <option value="33,33041">청주시 상당구 </option>
                <option value="33,33042">청주시 서원구 </option>
                <option value="33,33043">청주시 흥덕구 </option>
                <option value="33,33044">청주시 청원구 </option>
                <option value="33,33320">보은군 </option>
                <option value="33,33330">옥천군 </option>
                <option value="33,33340">영동군 </option>
                <option value="33,33350">진천군 </option>
                <option value="33,33360">괴산군 </option>
                <option value="33,33370">음성군 </option>
                <option value="33,33380">단양군 </option>
                <option value="33,33390">증평군 </option>
              </optgroup>
              <optgroup label="충남">
                <option value="34,34010">천안시 </option>
                <option value="34,34011">천안시 동남구 </option>
                <option value="34,34012">천안시 서북구 </option>
                <option value="34,34020">공주시 </option>
                <option value="34,34030">보령시 </option>
                <option value="34,34040">아산시 </option>
                <option value="34,34050">서산시 </option>
                <option value="34,34060">논산시 </option>
                <option value="34,34070">계룡시 </option>
                <option value="34,34080">당진시 </option>
                <option value="34,34310">금산군 </option>
                <option value="34,34330">부여군 </option>
                <option value="34,34340">서천군 </option>
                <option value="34,34350">청양군 </option>
                <option value="34,34360">홍성군 </option>
                <option value="34,34370">예산군 </option>
                <option value="34,34380">태안군 </option>
              </optgroup>
              <optgroup label="전북">
                <option value="35,35010">전주시 </option>
                <option value="35,35011">전주시 완산구 </option>
                <option value="35,35012">전주시 덕진구 </option>
                <option value="35,35020">군산시 </option>
                <option value="35,35030">익산시 </option>
                <option value="35,35040">정읍시 </option>
                <option value="35,35050">남원시 </option>
                <option value="35,35060">김제시 </option>
                <option value="35,35310">완주군 </option>
                <option value="35,35320">진안군 </option>
                <option value="35,35330">무주군 </option>
                <option value="35,35340">장수군 </option>
                <option value="35,35350">임실군 </option>
                <option value="35,35360">순창군 </option>
                <option value="35,35370">고창군 </option>
                <option value="35,35380">부안군</option>
              </optgroup>
              <optgroup label="전남">
                <option value="36,36010">목포시</option>
                <option value="36,36020">여수시</option>
                <option value="36,36030">순천시</option>
                <option value="36,36040">나주시</option>
                <option value="36,36060">광양시</option>
                <option value="36,36310">담양군</option>
                <option value="36,36320">곡성군</option>
                <option value="36,36330">구례군</option>
                <option value="36,36350">고흥군</option>
                <option value="36,36360">보성군</option>
                <option value="36,36370">화순군</option>
                <option value="36,36380">장흥군</option>
                <option value="36,36390">강진군</option>
                <option value="36,36400">해남군</option>
                <option value="36,36410">영암군</option>
                <option value="36,36420">무안군</option>
                <option value="36,36430">함평군</option>
                <option value="36,36440">영광군</option>
                <option value="36,36450">장성군</option>
                <option value="36,36460">완도군</option>
                <option value="36,36470">진도군</option>
                <option value="36,36480">신안군</option>
              </optgroup>
              <optgroup label="경북">
                <option value="37,37010">포항시 </option>
                <option value="37,37011">포항시 남구 </option>
                <option value="37,37012">포항시 북구 </option>
                <option value="37,37020">경주시 </option>
                <option value="37,37030">김천시 </option>
                <option value="37,37040">안동시 </option>
                <option value="37,37050">구미시 </option>
                <option value="37,37060">영주시 </option>
                <option value="37,37070">영천시 </option>
                <option value="37,37080">상주시 </option>
                <option value="37,37090">문경시 </option>
                <option value="37,37100">경산시 </option>
                <option value="37,37310">군위군 </option>
                <option value="37,37320">의성군 </option>
                <option value="37,37330">청송군 </option>
                <option value="37,37340">영양군 </option>
                <option value="37,37350">영덕군 </option>
                <option value="37,37360">청도군 </option>
                <option value="37,37370">고령군 </option>
                <option value="37,37380">성주군 </option>
                <option value="37,37390">칠곡군 </option>
                <option value="37,37400">예천군 </option>
                <option value="37,37410">봉화군 </option>
                <option value="37,37420">울진군 </option>
                <option value="37,37430">울릉군 </option>
              </optgroup>
              <optgroup label="경남">
                <option value="38,38030">진주시 </option>
                <option value="38,38050">통영시 </option>
                <option value="38,38060">사천시 </option>
                <option value="38,38070">김해시 </option>
                <option value="38,38080">밀양시 </option>
                <option value="38,38090">거제시 </option>
                <option value="38,38100">양산시 </option>
                <option value="38,38110">창원시 </option>
                <option value="38,38111">창원시 의창구 </option>
                <option value="38,38112">창원시 성산구 </option>
                <option value="38,38113">창원시 마산합포구 </option>
                <option value="38,38114">창원시 마산회원구 </option>
                <option value="38,38115">창원시 진해구 </option>
                <option value="38,38310">의령군 </option>
                <option value="38,38320">함안군 </option>
                <option value="38,38330">창녕군 </option>
                <option value="38,38340">고성군 </option>
                <option value="38,38350">남해군 </option>
                <option value="38,38360">하동군 </option>
                <option value="38,38370">산청군 </option>
                <option value="38,38380">함양군 </option>
                <option value="38,38390">거창군 </option>
                <option value="38,38400">합천군</option>
              </optgroup>
              <optgroup label="제주">
                <option value="39,39010">제주시</option>
                <option value="39,39020">서귀포시</option>
              </optgroup>
            </select>
            <button
              type="button"
              onClick={handleLibrary}
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-sm p-2 font-semibold"
            >
              도서관 검색
            </button>
          </div>
        </div>

        <p className="font-bold text-2xl mb-5">검색 결과</p>
        <div className="flex flex-col gap-2">
          {availableLibs.length === 0 && (
            <img src="/img/NoResult.png" className="size-100" />
          )}
          {availableLibs.length > 0 &&
            availableLibs.map((availableLib) => {
              console.log(availableLib);
              const lib = availableLib.lib;
              return (
                <div
                  key={`lib${lib.libCode}`}
                  className="border-stone-200 border rounded-sm bg-white shadow-2xl flex items-center p-5 gap-5"
                >
                  <div className="p-5 rounded-full h-30 w-30 bg-green-500 flex items-center justify-center">
                    <IoLibraryOutline size={"100"} color="white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-xl">{lib.libName}</p>
                    <div className="flex items-center gap-2">
                      <IoMdHome size={"20"} />
                      <p className="text-sm">{lib.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdOutlinePhoneAndroid size={"20"} />
                      <p className="text-sm">{lib.tel}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex flex-col w-full max-w-7xl mx-auto items-center gap-2 p-2 lg:p-0">
        <p className="font-bold text-2xl self-baseline my-5">리뷰</p>
        {reviews.length === 0 && (
          <p className="font-semibold text-xl">아직 남긴 리뷰가 없어요!</p>
        )}
        {reviews &&
          reviews.map((comment) => {
            return (
              <Comment
                key={`comment${comment.id}`}
                review={comment}
                className="w-full rounded-sm border border-stone-300 p-2 pl-3"
              />
            );
          })}
      </div>
      <div className="flex w-full max-w-7xl p-2 lg:p-0 mx-auto justify-center">
        <div className="flex my-15 w-full max-w-7xl mx-auto justify-center border-2 rounded-sm border-stone-200 p-5">
          <div className="flex flex-col max-w-7xl w-full gap-2">
            <p className="font-semibold text-lg mb-5">
              <span className="font-bold text-xl">'{bookDetails.title}'</span>
              은(는) 어땠나요? 리뷰를 작성해주세요!
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {" "}
                <img
                  src="/img/avatar.png"
                  className="h-10 w-10 object-cover block"
                />
                <p className="text-lg m-1">{user.nickname}</p>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={`lable-star-${value}`} htmlFor={`star${value}`}>
                    {value > review.rating ? (
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
              className="flex w-full h-30 outline-none wrap-anywhere bg-stone-100 rounded-sm p-2"
              value={review.content}
              onChange={(e) =>
                setReview({ ...review, content: e.currentTarget.value })
              }
            />

            <button
              type="button"
              onClick={handleReviewSubmit}
              className="bg-sky-500 hover:bg-sky-600 font-bold text-white rounded-md p-2 m-2 self-end w-auto"
            >
              <p className="text-white font-bold">작성</p>
            </button>
            <>
              <input
                type="radio"
                name="rating"
                id="star1"
                value={1}
                onClick={(e) =>
                  setReview({ ...review, rating: e.currentTarget.value })
                }
                className="hidden"
              />
              <input
                type="radio"
                name="rating"
                id="star2"
                value={2}
                onClick={(e) =>
                  setReview({ ...review, rating: e.currentTarget.value })
                }
                className="hidden"
              />
              <input
                type="radio"
                name="rating"
                id="star3"
                value={3}
                onClick={(e) =>
                  setReview({ ...review, rating: e.currentTarget.value })
                }
                className="hidden"
              />
              <input
                type="radio"
                name="rating"
                id="star4"
                value={4}
                onClick={(e) =>
                  setReview({ ...review, rating: e.currentTarget.value })
                }
                className="hidden"
              />
              <input
                type="radio"
                name="rating"
                id="star5"
                value={5}
                onClick={(e) =>
                  setReview({ ...review, rating: e.currentTarget.value })
                }
                className="hidden"
              />
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

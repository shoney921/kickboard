import { useState, useEffect } from "react";
import axios from "axios";
import "./res/index.css";

const USER_NO = "ME00001";

function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(2); // yy 형식으로 추출
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // MM 형식으로 추출
  const day = ("0" + date.getDate()).slice(-2); // dd 형식으로 추출
  const hours = ("0" + date.getHours()).slice(-2); // hh 형식으로 추출
  const minutes = ("0" + date.getMinutes()).slice(-2); // mm 형식으로 추출

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function App() {
  const [ptype, setPtype] = useState("1");
  const [userName, setUserName] = useState("");
  const [usageCount, setUsageCount] = useState("");
  const [usageMinute, setUsageMinute] = useState("");
  const [usageMeter, setUsageMeter] = useState("");
  const [carbonReduction, setCarbonReduction] = useState("");
  const [usageList, setUsageList] = useState([]);

  const getUserData = (input) => () => {
    setPtype(input);
  };

  const getUserName = () => {
    axios
      .get(`http://localhost:8080/api/v1/user/${USER_NO}`)
      .then((response) => {
        setUserName(response.data?.name);
      });
  };

  const getSummary = () => {
    axios
      .get(
        `http://localhost:8080/api/v1/user/${USER_NO}/usage/summary?ptype=${ptype}`
      )
      .then((res) => {
        setUsageCount(res.data.usage_count);
        setUsageMinute(res.data.usage_minute);
        setUsageMeter(Number((res.data.usage_meter / 1000).toFixed(1)));
        setCarbonReduction(res.data.carbon_reduction);
      });
  };

  const getUsageList = () => {
    axios
      .get(`http://localhost:8080/api/v1/user/${USER_NO}/usage?ptype=${ptype}`)
      .then((res) => {
        setUsageList(res.data?.list);
      });
  };

  console.log(usageList);

  useEffect(() => {
    getUserName();
  }, []);

  useEffect(() => {
    getUsageList();
    getSummary();
  }, [ptype]);

  return (
    <div>
      <div className="main-title">
        <h1>서비스 이용내역</h1>
        <div>{userName}</div>
      </div>
      <hr />

      <div className="service-summary">
        <div className="service-summary-tab">
          <button
            className={ptype === 1 ? "tablinks on" : "tablinks"}
            onClick={getUserData(1)}
          >
            1주일
          </button>
          <button
            className={ptype === 2 ? "tablinks on" : "tablinks"}
            onClick={getUserData(2)}
          >
            1개월
          </button>
          <button
            className={ptype === 3 ? "tablinks on" : "tablinks"}
            onClick={getUserData(3)}
          >
            3개월
          </button>
        </div>
        <div className="spacer-20"></div>
        <div className="service-summary-detail-container">
          <div className="color-gray">이용건수</div>
          <div>{usageCount}건</div>
          <div className="color-gray">이용시간</div>
          <div>{usageMinute}분</div>
          <div className="color-gray">이동거리</div>
          <div>{usageMeter}km</div>
          <div className="color-gray">탄소절감효과</div>
          <div>{carbonReduction}kg</div>
        </div>
      </div>

      <hr />

      <div className="service-list-container">
        {usageList.map((usageData) => (
          <>
            <div className="service-list-content">
              <div className="service-list-header">
                <span>
                  {Number((usageData.useDistance / 1000).toFixed(1))}km
                </span>
                <span className="color-gray ml-10">{usageData.useTime}분</span>
              </div>
              <div className="service-list-body">
                <div className="color-gray">이용시간</div>
                <div>
                  {formatDate(usageData.useStartDt)} ~{" "}
                  {formatDate(usageData.useEndDt)}
                </div>
                <div className="color-gray">결제일시</div>
                <div>{formatDate(usageData.payDatetime)}</div>
                <div className="color-gray">결제수단</div>
                <div>
                  {usageData.cardPay ? (
                    <span>카드 {usageData.cardPay}원</span>
                  ) : null}
                  {usageData.cardPay !== null && usageData.pointPay !== null ? (
                    <span> + </span>
                  ) : null}
                  {usageData.pointPay ? (
                    <span>포인트 {usageData.pointPay}P </span>
                  ) : null}
                </div>
              </div>
            </div>
            <hr />
          </>
        ))}
      </div>

      {usageList.length === 0 && (
        <div className="service-empty">
          <div className="service-empty-container">
            <div className="service-empty-message">조회된 정보가 없습니다.</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

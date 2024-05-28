import React, { useState, useEffect } from "react";
import axios from "axios";

interface DataItem {
  // ここにAPIから取得するデータの型を定義します
}

const executeStatement = (sql: string) => {
  const fetchData = async () => {
    try {
      const response = await axios.get<DataItem[]>(
        "https://spladvice-service-a3w4oxiwva-an.a.run.app/data"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  fetchData();
};

const SearchCommon: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>(
          "https://spladvice-service-a3w4oxiwva-an.a.run.app/data"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data from API</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{/* ここにデータを表示するコードを書きます */}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchCommon;

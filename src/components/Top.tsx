import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Top.module.css";
import ArticleRanking from "./ArticleRanking";

const Top: React.FC = () => {
  const navigate = useNavigate(); // ナビゲーション用のhistoryオブジェクトを使用

  return (
    <div className={styles["top"]}>
      <div className={styles["top-container"]}>
        <div className={styles["center-left"]}>
          <h1>Spladvice</h1>
          <div>スプラトゥーン３に関するアドバイス・コツを投稿！</div>
          <div>みんなで知識を共有して、もっと強くなろう！</div>
          <button onClick={() => navigate("/RegisterForm")}>
            新規会員登録
          </button>
        </div>
        <div className={styles["center-right"]}>
          {/* <img
            className={styles["top-img"]}
            src="/img/shooter/Splattershot.png"
          /> */}
        </div>
      </div>
      <ArticleRanking />
    </div>
  );
};

export default Top;

import React, { useState, useEffect, ReactElement } from "react";
import { Article } from "./ArticleForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext";
import { stripHtml } from "./RenderHtml";

import styles from "./ArticlesCommon.module.css";

const MyPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();
  const { user, handleLogout } = useUser();

  const fetchArticlesByUserId = async (userId: string) => {
    axios
      .get("https://spladvice-service-a3w4oxiwva-an.a.run.app/searchByUserId", {
        params: {
          query: userId,
        },
      })
      .then((response) => {
        const articles = response.data.map((record: any) => ({
          id: record.article_id,
          title: record.article_title,
          content: record.article_content,
          userId: record.author_id,
          likes: record.article_likes,
          bukiId: record.buki_id,
          bukiName: record.buki.buki_mei_jp,
          bukiType: record.buki.buki_type,
          bukiImg: record.buki.buki_img,
        }));
        setArticles(articles);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    if (user) {
      fetchArticlesByUserId(user.userId);
    } else {
      navigate("/LoginForm");
    }
  }, []);

  const handleArticleClick = (articleId: string, userId: string) => {
    navigate("/ArticleDetail", { state: { articleId, userId } });
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/LoginForm");
  };

  return (
    <div>
      {user && (
        <div className={`${styles["mypage-menu"]} component-top`}>
          <h2>メニュー</h2>
          <button onClick={() => navigate("/ArticleForm")}>新規投稿</button>
          <button onClick={handleLogoutClick}>ログアウト</button>
        </div>
      )}
      {user && (
        <div className={`${styles["articles"]} component-top`}>
          <h2>{user.displayName}の記事一覧</h2>
          <ul className={styles["articles-container"]}>
            {articles.map((article, index) => (
              <li
                key={article.id}
                onClick={() => handleArticleClick(article.id!, article.userId!)}
                className={styles["articles-card"]}
              >
                {/* <div className={styles["articles-ranking"]}>{index + 1}</div> */}
                <img
                  className={styles["articles-img"]}
                  src={`./img/${article.bukiType}/${article.bukiImg}`}
                />
                <h3 className={styles["articles-title"]}>{article.title}</h3>
                <p className={styles["articles-content"]}>
                  {stripHtml(article.content!)}
                </p>
                <div className={styles["articles-display-name"]}>
                  {article.displayName}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyPage;

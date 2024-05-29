import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ArticlesCommon.module.css";
import { Article } from "./ArticleForm";
import { stripHtml } from "./RenderHtml";
import axios from "axios";

const ArticleRanking: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate(); // ナビゲーション用のhistoryオブジェクトを使用

  useEffect(() => {
    fetchArticlesSortByPv();
  }, []);

  const fetchArticlesSortByPv = async () => {
    axios
      .get(
        "https://spladvice-service-a3w4oxiwva-an.a.run.app/getArticleRanking"
      )
      .then((response) => {
        const articleRanking = response.data.map((record: any) => ({
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
        setArticles(articleRanking);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  // 記事IDをパラメータとして詳細ページに遷移する関数
  const handleArticleClick = (articleId: string) => {
    navigate("/ArticleDetail", { state: { articleId } }); // マイページに遷移
  };

  return (
    <div className={`${styles["articles"]} component-top`}>
      <h2>記事ランキング</h2>
      <ul className={styles["articles-container"]}>
        {articles.map((article, index) => (
          <li
            key={article.id}
            onClick={() => handleArticleClick(article.id!)}
            className={styles["articles-card"]}
          >
            <div className={styles["articles-ranking"]}>{index + 1}傑</div>
            <img
              className={styles["articles-img"]}
              src={`/spladvice-frontend/img/${article.bukiType}/${article.bukiImg}`}
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
  );
};

export default ArticleRanking;

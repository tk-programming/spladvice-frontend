import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Article } from "./ArticleForm";
import BukiGallery, { Buki } from "./BukiGallery";
import { stripHtml } from "./RenderHtml";
import styles from "./ArticlesCommon.module.css";

const SearchByBuki: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  const fetchArticlesByBukiId = async (imageId: string) => {
    axios
      .get("https://spladvice-service-a3w4oxiwva-an.a.run.app/searchByBuki", {
        params: {
          query: imageId, // バックエンドに渡すクエリパラメータ
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
        console.log(articles);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const handleBukiClick = (selectedBuki: Buki) => {
    fetchArticlesByBukiId(selectedBuki.id);
  };

  const handleArticleClick = (articleId: string) => {
    navigate("/ArticleDetail", { state: { articleId } });
  };

  return (
    <div className={`component-top`}>
      {/* 画像一覧を表示 */}
      <BukiGallery onBukiClick={handleBukiClick} />
      {/* 記事一覧を表示 */}
      <div className={`${styles["articles"]} component-top`}>
        <h2>検索結果一覧</h2>
        <ul className={styles["articles-container"]}>
          {articles.map((article, index) => (
            <li
              key={article.id}
              onClick={() => handleArticleClick(article.id!)}
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
    </div>
  );
};

export default SearchByBuki;

import React, { useState, useEffect } from "react";
import { Article } from "./ArticleForm";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext";
import parse from "html-react-parser";
import styles from "./ArticleDetail.module.css";

const ArticleDetail: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null); // ここで型を明示
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const article_id = location.state ? location.state.articleId : "DEFAULT_ID";
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const likeButtonClass = liked ? "liked" : "unliked";

  const fetchArticle = async () => {
    axios
      .get(
        "https://spladvice-service-a3w4oxiwva-an.a.run.app/getArticleDetail",
        {
          params: {
            query: article_id, // バックエンドに渡すクエリパラメータ
          },
        }
      )
      .then((response) => {
        const articleData: Article = {
          id: response.data[0].article_id,
          title: response.data[0].article_title,
          content: response.data[0].article_content,
          userId: response.data[0].author_id,
          likes: response.data[0].article_likes,
          bukiId: response.data[0].buki_id,
          bukiName: response.data[0].buki.buki_mei_jp,
          bukiType: response.data[0].buki.buki_type,
          bukiImg: response.data[0].buki.buki_img,
        };
        setArticle(articleData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  const handleEdit = (article: Article) => {
    navigate(`/ArticleForm`, { state: { article } });
  };

  const handleDelete = (article: Article) => {
    setShowConfirmation(true);
  };

  const handleLike = (article: Article) => {
    // HTTPリクエストを送って、いいね数を増やすか減らす
    axios
      .post(
        "https://spladvice-service-a3w4oxiwva-an.a.run.app/updateLikes",
        {
          articleId: article.id,
          increment: !liked,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        setLiked(!liked); // いいねの状態を反転させる
      })
      .catch((error) => {
        console.log("いいねできませんでした。");
      });
  };

  const handleConfirmDelete = (article: Article) => {
    // 記事削除
    axios
      .post(
        "https://spladvice-service-a3w4oxiwva-an.a.run.app/deleteArticle",
        {
          articleId: article.id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        console.log("削除できました。");
        // 削除しました画面を表示
        setShowDeleted(true);
      })
      .catch((error) => {
        console.log("削除できませんでした。");
        setShowDeleted(false);
      });

    // 確認画面を消す
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  if (!article) {
    return <div className={styles.body}>読み込み中...</div>;
  }

  return (
    <div className={styles["article-container"]}>
      <div className={styles["buki-container"]}>
        <div className={styles["buki-name"]}>{article.bukiName}</div>
        <img
          src={`./img/${article.bukiType}/${article.bukiImg}`}
          alt={article.bukiName}
        />
      </div>
      <h2 className={styles["article-title"]}>{article.title}</h2>
      <p className={styles["article-content"]}>{parse(article.content!)}</p>
      {article.userId === user?.userId && (
        <div className={styles["button-container"]}>
          <button
            className={styles["button-common"]}
            onClick={() => handleEdit(article)}
          >
            編集
          </button>
          <button
            className={styles["button-common"]}
            onClick={() => handleDelete(article)}
          >
            削除
          </button>
        </div>
      )}
      {user && article.userId !== user?.userId && (
        <div className={styles["button-container"]}>
          <button
            className={styles[likeButtonClass]}
            onClick={() => handleLike(article)}
          >
            {liked ? "いいね済み" : "いいね！"}
          </button>
        </div>
      )}
      {showConfirmation && (
        <div className={styles["modal-backdrop"]}>
          <div className={styles["confirmation-modal"]}>
            <p>本当に削除しますか？</p>
            <button
              className={styles["confirm-button"]}
              onClick={() => handleConfirmDelete(article)}
            >
              削除する
            </button>
            <button
              className={styles["cancel-button"]}
              onClick={handleCancelDelete}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
      {showDeleted && (
        <div className={styles["modal-backdrop"]}>
          <div className={styles["confirmation-modal"]}>
            <p>記事を削除しました。</p>
            <button onClick={() => navigate("/MyPage")}>マイページ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;

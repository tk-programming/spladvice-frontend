import React, { useState, useEffect } from "react";
import BukiGallery, { Buki } from "./BukiGallery";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import axios from "axios";
import styles from "./ArticleForm.module.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface Article {
  id?: string;
  img?: string;
  title?: string;
  content?: string;
  userId?: string;
  displayName?: string;
  likes?: string;
  bukiType?: string;
  bukiId?: string;
  bukiName?: string;
  bukiImg?: string;
}

const ArticleForm: React.FC<Article> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article>(
    location.state
      ? location.state.article
      : { id: 0, img: "", title: "", content: "", userId: "" }
  );
  const [selectedBuki, setSelectedBuki] = useState<Buki>();
  const { user } = useUser();
  const [showOkModal, setShowOkModal] = useState(false); // 投稿完了時に表示するモーダルを制御
  const [showNgModal, setShowNgModal] = useState(false); // 投稿できなかった時に表示するモーダルを制御

  const headerTitle = article.id ? "編集" : "新規投稿";

  useEffect(() => {
    if (user?.userId) {
      setArticle({ ...article, userId: user.userId });
      if (article.bukiId) {
        setSelectedBuki({
          id: article.bukiId,
          name: article.bukiName,
          img: article.bukiImg,
          type: article.bukiType,
        });
      }
    } else {
      setArticle(article);
    }
    console.log(article);
    console.log(selectedBuki);
  }, []);

  const handleBukiClick = (selectedBuki: Buki) => {
    console.log(selectedBuki);
    setSelectedBuki(selectedBuki);
    setArticle({ ...article, bukiId: selectedBuki.id });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleContentChange = (content: string) => {
    setArticle({ ...article, content: content });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("送信ボタンが押された");
    onSubmit(article);
  };

  const onSubmit = (article: Article) => {
    if (article.id) {
      // article.idが存在する = 編集
      axios
        .post(
          "https://spladvice-service-a3w4oxiwva-an.a.run.app/updateArticle",
          {
            bukiId: article.bukiId,
            title: article.title,
            content: article.content, // 最新の記事内容を送信
            userId: article.userId,
            articleId: article.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setShowOkModal(true);
        })
        .catch((error) => {
          setShowNgModal(true);
        });
    } else {
      // article.idが存在しない = 新規投稿
      axios
        .post(
          "https://spladvice-service-a3w4oxiwva-an.a.run.app/registerArticle",
          {
            bukiId: article.bukiId,
            title: article.title,
            content: article.content,
            userId: article.userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setShowOkModal(true);
        })
        .catch((error) => {
          setShowNgModal(true);
        });
    }
  };

  return (
    <div className={`${styles["form-container"]} component-top`}>
      <h1 className={styles["form-header"]}>{headerTitle}</h1>
      <form onSubmit={handleSubmit} className={styles["form-style"]}>
        <div className={styles["form-child"]}>
          <h2>ブキ</h2>
          <div className={styles["input-buki"]}>
            {selectedBuki && (
              <img
                key={selectedBuki.id}
                src={`/img/${selectedBuki.type}/${selectedBuki.img}`}
                alt={selectedBuki.id}
              />
            )}
            <BukiGallery onBukiClick={handleBukiClick} />
          </div>
        </div>
        <div className={styles["form-child"]}>
          <h2>タイトル</h2>
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={handleChange}
            placeholder="タイトル"
            className={styles["input-field"]}
          />
        </div>
        <div className={styles["form-child"]}>
          <h2>記事内容</h2>
          <ReactQuill
            theme="snow"
            value={article.content}
            onChange={handleContentChange}
          />
        </div>
        <input name="bukiId" type="hidden" value={article.bukiId} />
        <input name="content" type="hidden" value={article.content} />
        <input name="userId" type="hidden" value={user?.userId} />
        <input name="articleId" type="hidden" value={article.id} />
        <button type="submit" className={styles["submit-button"]}>
          送信
        </button>
        {showOkModal && (
          <div className={styles["modal-backdrop"]}>
            <div className={styles["confirmation-modal"]}>
              <p>記事を投稿しました。</p>
              <button onClick={() => navigate("/MyPage")}>マイページ</button>
            </div>
          </div>
        )}
        {showNgModal && (
          <div className={styles["modal-backdrop"]}>
            <div className={styles["confirmation-modal"]}>
              <p>記事を投稿できませんでした。入力内容を確認してください。</p>
              <button onClick={() => setShowNgModal(false)}>戻る</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ArticleForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./LoginForm.module.css";
import stylesModule from "./ArticleDetail.module.css";

interface FormData {
  displayName: string;
  userId: string;
  password: string;
}

const RegisterForm = () => {
  const navigate = useNavigate(); // ナビゲーション用のhistoryオブジェクトを使用
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    userId: "",
    password: "",
  });
  const [errorMessages, setErrorMessages] = useState<FormData>({
    displayName: "",
    userId: "",
    password: "",
  });
  const [successModal, setSuccessModal] = useState(false);
  const [failureModal, setFailureModal] = useState(false);
  const [dbErrorMessage, setDbErrorMessage] = useState();

  const hankakuAlphaNumeric = /^[A-Za-z0-9]+$/; // 半角英数字のみ
  const zenkakuHankakuAlphaNumeric = /^[A-Za-z0-9ぁ-んァ-ン一-龥]+$/; // 全角半角英数字

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // 空白チェック
    if (value.trim() === "") {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [name]: "入力してください。",
      }));
    } else {
      setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }

    // 文字数の上限値チェック、文字種チェック
    if (name === "displayName") {
      if (value.length > 50 || !zenkakuHankakuAlphaNumeric.test(value)) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [name]: "全角半角英数字50文字以内で入力してください。",
        }));
      }
    } else if (name === "userId" || name === "password") {
      if (value.length > 20 || !hankakuAlphaNumeric.test(value)) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [name]: "半角英数字20文字以内で入力してください。",
        }));
      }
    } else {
      setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleRegister = async () => {
    // formDataの各フィールドに対する空白チェック
    const errors = {
      displayName: formData.displayName.trim()
        ? ""
        : "表示名を入力してください",
      userId: formData.userId.trim() ? "" : "IDを入力してください",
      password: formData.password.trim() ? "" : "パスワードを入力してください",
    };

    if (!Object.values(errors).some((error) => error !== "")) {
      // 文字数の上限値チェック
      if (
        formData.displayName.length > 50 ||
        !zenkakuHankakuAlphaNumeric.test(formData.displayName)
      ) {
        errors.displayName = "全角半角英数字50文字以内で入力してください。";
      }
      if (
        formData.userId.length > 20 ||
        !hankakuAlphaNumeric.test(formData.userId)
      ) {
        errors.userId = "半角英数字20文字以内で入力してください。";
      }
      if (
        formData.password.length > 20 ||
        !hankakuAlphaNumeric.test(formData.password)
      ) {
        errors.password = "半角英数字20文字以内で入力してください。";
      }
    }

    // エラーがあるかどうかチェック
    if (Object.values(errors).some((error) => error !== "")) {
      setErrorMessages(errors); // エラーメッセージを更新
      setFailureModal(true); // エラーモーダルを表示
    } else {
      // DBに登録
      axios
        .post(
          "https://spladvice-service-a3w4oxiwva-an.a.run.app/register",
          {
            displayName: formData.displayName,
            userId: formData.userId,
            password: formData.password,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          // 登録できましたモーダル表示
          setFailureModal(false);
          setSuccessModal(true);
        })
        .catch((error) => {
          // エラーで登録できませんでしたモーダル表示
          setSuccessModal(false);
          setFailureModal(true);
          setDbErrorMessage(error.response.data.error);
        });
    }
  };

  return (
    <div className={`${styles["login-form"]} component-top`}>
      <h2>新規会員登録</h2>
      <div className={styles["login-form-child"]}>
        <label className={styles["login-form-label"]} htmlFor="displayName">
          表示名:
        </label>
        <input
          className={`${styles["login-form-input"]} ${
            errorMessages.displayName ? styles["error"] : ""
          }`}
          type="text"
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="(全角半角英数字。50文字まで)"
        />
        {errorMessages.displayName && (
          <div className={styles["error-message"]}>
            {errorMessages.displayName}
          </div>
        )}
      </div>
      <div className={styles["login-form-child"]}>
        <label className={styles["login-form-label"]} htmlFor="userId">
          ID:
        </label>
        <input
          className={`${styles["login-form-input"]} ${
            errorMessages.userId ? styles["error"] : ""
          }`}
          type="text"
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          placeholder="(半角英数字。20文字まで)"
        />
        {errorMessages.userId && (
          <div className={styles["error-message"]}>{errorMessages.userId}</div>
        )}
      </div>
      <div className={styles["login-form-child"]}>
        <label className={styles['login-form-label"']} htmlFor="password">
          パスワード:
        </label>
        <input
          className={`${styles["login-form-input"]} ${
            errorMessages.password ? styles["error"] : ""
          }`}
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="(半角英数字。20文字まで)"
        />
        {errorMessages.password && (
          <div className={styles["error-message"]}>
            {errorMessages.password}
          </div>
        )}
      </div>
      <button className={styles["login-button"]} onClick={handleRegister}>
        登録
      </button>
      {successModal && (
        <div className={stylesModule["modal-backdrop"]}>
          <div className={stylesModule["confirmation-modal"]}>
            <h2>登録成功</h2>
            <p>登録してくれてありがとう！</p>
            <button onClick={() => navigate("/LoginForm")}>ログイン</button>
          </div>
        </div>
      )}
      {failureModal && (
        <div className={stylesModule["modal-backdrop"]}>
          <div className={stylesModule["confirmation-modal"]}>
            <h2>登録失敗</h2>
            <p>登録できませんでした。もう一度お試しください。</p>
            <p>{dbErrorMessage}</p>
            <button onClick={() => setFailureModal(false)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;

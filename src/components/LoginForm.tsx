import React, { useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

const LoginForm: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ナビゲーション用のhistoryオブジェクトを使用
  const { handleLogin } = useUser();

  const login = () => {
    handleLogin(userId, password, () => {
      navigate("/MyPage"); // ログイン成功時にマイページに遷移
    });
  };

  return (
    <div className={`${styles["login-form"]} component-top`}>
      <h2>ログイン</h2>
      <div className={styles["login-form-child"]}>
        <label className={styles["login-form-label"]} htmlFor="userId">
          ID:
        </label>
        <input
          className={styles["login-form-input"]}
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div className={styles["login-form-child"]}>
        <label className={styles['login-form-label"']} htmlFor="password">
          パスワード:
        </label>
        <input
          className={styles["login-form-input"]}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className={styles["login-button"]} onClick={login}>
        ログイン
      </button>
    </div>
  );
};

export default LoginForm;

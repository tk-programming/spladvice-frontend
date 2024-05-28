// Header.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate(); // useNavigateフックを使用
  const location = useLocation();
  const userId = location.state ? location.state.userId : null;
  const displayName = location.state ? location.state.displayName : null;

  return (
    <header>
      <h1 onClick={() => navigate("/")}>Spladvice</h1>
      <nav className="nav-bar">
        <button onClick={() => navigate("/RegisterForm")}>新規会員登録</button>
        <button onClick={() => navigate("/MyPage")}>マイページ</button>
        <button onClick={() => navigate("/SearchByBuki")}>ブキから検索</button>
        <button onClick={() => navigate("/ArticleRanking")}>
          記事ランキング
        </button>
      </nav>
    </header>
  );
};

export default Header;

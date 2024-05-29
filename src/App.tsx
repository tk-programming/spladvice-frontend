import React, { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header"; // ヘッダーコンポーネントをインポート
import Top from "./components/Top";
import MyPage from "./components/MyPage";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ArticleForm from "./components/ArticleForm";
import ArticleDetail from "./components/ArticleDetail";
import ArticleRanking from "./components/ArticleRanking";
import SearchByBuki from "./components/SearchByBuki";
import { UserProvider, useUser } from "./components/UserContext";
import "./App.css";

const useCheckAuth = () => {
  const user = useUser();
  return user;
};

interface PrivateRouteProps {
  children: React.ReactElement;
}

// プライベートルートコンポーネント
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const auth = useCheckAuth(); // カスタムフックを使用
  return auth ? children : <Navigate to="/LoginForm" />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header /> {/* 全てのページで表示されるヘッダー */}
        <Routes>
          <Route path="/" element={<Top />} />
          <Route
            path="/MyPage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
          <Route path="/RegisterForm" element={<RegisterForm />} />
          <Route path="/LoginForm" element={<LoginForm />} />
          <Route
            path="/ArticleForm"
            element={
              <PrivateRoute>
                <ArticleForm />
              </PrivateRoute>
            }
          />
          <Route path="/ArticleDetail" element={<ArticleDetail />} />
          <Route path="/ArticleRanking" element={<ArticleRanking />} />
          <Route path="/SearchByBuki" element={<SearchByBuki />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;

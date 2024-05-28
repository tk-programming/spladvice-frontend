import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

interface User {
  userId: string;
  displayName: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleLogin: (
    userId: string,
    password: string,
    onSuccess: () => void
  ) => void;
  handleLogout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // ログインを処理する関数
  const handleLogin = (
    userId: string,
    password: string,
    onSuccess: () => void
  ) => {
    // ログイン処理（API呼び出し等）
    axios
      .get("https://spladvice-service-a3w4oxiwva-an.a.run.app/login", {
        params: {
          userId: userId, // バックエンドに渡すクエリパラメータ
          password: password, // バックエンドに渡すクエリパラメータ
        },
      })
      .then((response) => {
        const userData: User = {
          userId: response.data[0].user_id,
          displayName: response.data[0].display_name,
        };
        setUser(userData);
        onSuccess(); // コールバック関数を呼び出す
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        alert("IDまたはパスワードが間違っています。");
      });
  };

  const handleLogout = () => {
    // ユーザー情報をクリア
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

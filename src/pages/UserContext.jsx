import { createContext, useContext, useEffect, useState } from "react";

// =========================
// 🌐 CONTEXTO
// =========================
const UserContext = createContext();

// =========================
// 🧠 PROVIDER
// =========================
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // =========================
  // 🔄 CARREGAR USUÁRIO
  // =========================
  useEffect(() => {
    try {
      const sessionData = localStorage.getItem("cityhouse_session");

      if (sessionData) {
        const parsed = JSON.parse(sessionData);

        // 🔒 Validação básica
        if (parsed && parsed.id) {
          setUser(parsed);
        } else {
          localStorage.removeItem("cityhouse_session");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Erro ao ler sessão:", err);
      localStorage.removeItem("cityhouse_session");
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // =========================
  // 🔐 LOGIN
  // =========================
  const login = (userData) => {
    if (!userData) return;

    localStorage.setItem(
      "cityhouse_session",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  // =========================
  // 🚪 LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("cityhouse_session");
    setUser(null);
  };

  // =========================
  // 🔄 ATUALIZAR USER
  // =========================
  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };

      localStorage.setItem(
        "cityhouse_session",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateUser,
        loadingUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// =========================
// 🎯 HOOK CUSTOMIZADO
// =========================
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro do UserProvider");
  }

  return context;
}

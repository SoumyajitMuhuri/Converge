import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("token")),
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("converge-theme") || "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("converge-theme", theme);
  }, [theme]);

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  if (!isAuthenticated) {
    return (
      <Auth
        onLogin={handleLogin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}

export default App;

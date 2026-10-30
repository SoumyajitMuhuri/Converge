import { useState } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("token")),
  );

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
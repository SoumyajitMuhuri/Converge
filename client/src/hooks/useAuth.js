import { useState } from "react";
import { api } from "../services/api";

function useAuth(onLogin) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credentials = { email, password };

      const result = isRegistering
        ? await api.register({ name, ...credentials })
        : await api.login(credentials);

      const token =
        result?.token ||
        result?.data?.token ||
        result?.accessToken ||
        result?.data?.accessToken;

      if (!token) {
        throw new Error("No authentication token was returned.");
      }

      localStorage.setItem("token", token);
      onLogin();
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsRegistering((current) => !current);
    setError("");
  }

  return {
    isRegistering,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    toggleMode,
  };
}

export default useAuth;
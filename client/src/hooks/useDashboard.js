import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

function useDashboard() {
  const [links, setLinks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shortening, setShortening] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const refreshAnalytics = useCallback(async () => {
    const result = await api.getDashboardAnalytics();

    setAnalytics(
      result?.analytics ||
        result?.data?.analytics ||
        result,
    );
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [linksResult, analyticsResult] = await Promise.allSettled([
        api.getLinks(),
        api.getDashboardAnalytics(),
      ]);

      if (linksResult.status === "fulfilled") {
        const result = linksResult.value;

        setLinks(
          Array.isArray(result)
            ? result
            : result?.links || result?.data?.links || [],
        );
      } else {
        setError(
          linksResult.reason?.message || "Unable to load your links.",
        );
      }

      if (analyticsResult.status === "fulfilled") {
        const result = analyticsResult.value;

        setAnalytics(
          result?.analytics ||
            result?.data?.analytics ||
            result,
        );
      } else {
        setAnalytics(null);

        if (linksResult.status === "fulfilled") {
          setError(
            analyticsResult.reason?.message ||
              "Links loaded, but analytics could not be retrieved.",
          );
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  fetchDashboard();

  const intervalId = setInterval(() => {
    fetchDashboard();
  }, 10000);

  return () => clearInterval(intervalId);
}, [fetchDashboard]);

  const handleShorten = async (originalUrl) => {
    setShortening(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await api.createLink({ originalUrl });

      const newLink =
        result?.link ||
        result?.data?.link ||
        result?.data ||
        result;

      if (!newLink?.shortCode && !newLink?.shortUrl) {
        throw new Error(
          "The server response did not contain a shortened link.",
        );
      }

      const normalizedLink = {
        ...newLink,
        id: newLink.id || newLink._id,
      };

      setLinks((currentLinks) => [
        normalizedLink,
        ...currentLinks.filter(
          (link) =>
            (link.id || link._id) !==
            (normalizedLink.id || normalizedLink._id),
        ),
      ]);

      setSuccessMessage("Your link has been shortened successfully.");

      try {
        await refreshAnalytics();
      } catch {
        // Link creation succeeded even if refreshing analytics failed.
      }

      return normalizedLink;
    } catch (err) {
      setError(err.message || "Unable to shorten this URL.");
      throw err;
    } finally {
      setShortening(false);
    }
  };

  const handleDelete = async (link) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the link "${link.shortCode || "this link"}"?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccessMessage("");

    try {
      await api.deleteLink(link.id || link._id);

      setLinks((currentLinks) =>
        currentLinks.filter(
          (item) =>
            (item.id || item._id) !== (link.id || link._id),
        ),
      );

      setSuccessMessage("Link deleted successfully.");

      try {
        await refreshAnalytics();
      } catch {
        // Deletion succeeded; analytics can refresh later.
      }
    } catch (err) {
      setError(err.message || "Unable to delete this link.");
    }
  };

  const handleShowQr = (link) => {
    if (link.qrCodeUrl) {
      window.open(link.qrCodeUrl, "_blank", "noopener,noreferrer");
    } else {
      setError("A QR code is not available for this link.");
    }
  };

  const dismissError = () => setError("");
  const dismissSuccess = () => setSuccessMessage("");

  return {
    links,
    analytics,
    loading,
    shortening,
    error,
    successMessage,
    handleShorten,
    handleDelete,
    handleShowQr,
    fetchDashboard,
    dismissError,
    dismissSuccess,
  };
}

export default useDashboard;
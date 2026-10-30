import { useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";

function QuickShorten({ onShorten, loading = false }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setShortenedUrl("");
    setCopied(false);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a URL to shorten.");
      return;
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      setError("Enter a valid URL, including https://.");
      return;
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      setError("Only HTTP and HTTPS URLs are supported.");
      return;
    }

    if (!onShorten) {
      setError("URL shortening is not connected yet.");
      return;
    }

    try {
      const result = await onShorten(trimmedUrl);

      if (!result?.shortUrl) {
        throw new Error("The server did not return a short URL.");
      }

      setShortenedUrl(result.shortUrl);
      setUrl("");
    } catch (err) {
      setError(err.message || "Unable to shorten this URL. Please try again.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
    } catch {
      setError("Couldn't copy automatically. Please copy the link manually.");
    }
  };

  return (
    <section className="theme-surface p-5 sm:p-7">
      <div className="mb-5">
        <p className="theme-accent-text text-xs font-semibold uppercase tracking-[0.14em]">
          Create a link
        </p>
        <h2 className="theme-ink mt-2 text-xl font-semibold tracking-tight">
          Shorten a URL
        </h2>
        <p className="theme-ink-secondary mt-1.5 text-sm leading-6">
          Paste a destination URL to create a shorter link you can share.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="block min-w-0 flex-1">
          <span className="sr-only">URL to shorten</span>
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/your-long-link"
            aria-label="URL to shorten"
            aria-invalid={Boolean(error)}
            className="theme-control h-11 w-full min-w-0 px-3.5 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="theme-primary-button shrink-0 px-5"
        >
          {loading ? "Shortening…" : "Shorten URL"}
          {!loading && <ArrowRight size={16} aria-hidden="true" />}
        </button>
      </form>

      {error && (
        <p role="alert" className="theme-alert-error mt-3 px-3.5 py-3 text-sm">
          {error}
        </p>
      )}

      {shortenedUrl && (
        <div className="theme-surface-quiet mt-4 flex flex-col gap-3 rounded-lg border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="theme-ink-secondary text-xs font-medium">
              Short link ready
            </p>
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noreferrer"
              className="theme-link mt-1 block break-all text-sm font-semibold"
            >
              {shortenedUrl}
            </a>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="theme-secondary-button shrink-0"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </section>
  );
}

export default QuickShorten;

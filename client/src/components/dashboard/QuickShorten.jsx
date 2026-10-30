import { useState } from "react";
import { ArrowRight, Check, Copy, Link2, Sparkles } from "lucide-react";

function QuickShorten({ onShorten, loading = false }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setShortenedUrl("");

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
    } catch {
      setError("Couldn't copy automatically. Please copy the link manually.");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 p-6 shadow-lg shadow-violet-200/60 sm:p-8">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-violet-100">
              <Sparkles size={13} />
              Quick shorten
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Make your links work harder.
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-violet-100">
              Turn long URLs into clean, shareable links and start tracking
              their performance.
            </p>
          </div>

          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 sm:flex">
            <Link2 size={24} className="text-white" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/30 bg-white px-4 py-3.5 shadow-sm focus-within:ring-4 focus-within:ring-white/20">
            <Link2 size={19} className="shrink-0 text-slate-400" />

            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Paste your long URL here..."
              aria-label="URL to shorten"
              aria-invalid={Boolean(error)}
              className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Shortening..." : "Shorten URL"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-white">
            {error}
          </p>
        )}

        {shortenedUrl && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/20 bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-violet-100">
                Your shortened link is ready
              </p>

              <a
                href={shortenedUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block break-all text-sm font-semibold text-white underline decoration-white/40 underline-offset-4"
              >
                {shortenedUrl}
              </a>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              <Copy size={15} />
              Copy link
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-violet-100">
          <span className="inline-flex items-center gap-1.5">
            <Check size={14} />
            Fast redirects
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Check size={14} />
            Click analytics
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Check size={14} />
            QR code generation
          </span>
        </div>
      </div>
    </section>
  );
}

export default QuickShorten;
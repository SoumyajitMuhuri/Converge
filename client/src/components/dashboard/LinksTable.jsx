import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Link2,
  QrCode,
  Trash2,
} from "lucide-react";

function LinksTable({ links = [], onDelete, onShowQr }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (link) => {
    const shortUrl =
      link.shortUrl ||
      `${window.location.origin.replace(/\/$/, "")}/${link.shortCode}`;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(link.id || link._id || link.shortCode);

      setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch {
      window.prompt("Copy your shortened URL:", shortUrl);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="theme-surface overflow-hidden">
      <div className="theme-divider flex flex-col gap-1 border-b px-5 py-5 sm:px-6">
        <div>
          <h2 className="theme-ink text-base font-semibold">Your links</h2>
          <p className="theme-ink-secondary mt-1 text-sm">
            Your shortened URLs and their activity.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead>
            <tr className="theme-table-head theme-divider border-b">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider sm:px-6">
                Link
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">
                Visits
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">
                Created
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="theme-table-body">
            {links.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-14 text-center">
                  <div className="theme-auth-mark mx-auto">
                    <Link2 size={20} />
                  </div>

                  <p className="theme-ink mt-4 text-sm font-semibold">
                    No links yet
                  </p>

                  <p className="theme-ink-secondary mt-1 text-sm">
                    Your shortened links will appear here.
                  </p>
                </td>
              </tr>
            ) : (
              links.map((link) => {
                const shortUrl =
                  link.shortUrl ||
                  `${window.location.origin.replace(/\/$/, "")}/${link.shortCode}`;

                return (
                  <tr
                    key={link.id || link._id || link.shortCode}
                    className="theme-table-row transition-colors"
                  >
                    <td className="max-w-[360px] px-5 py-4 sm:px-6">
                      <div className="flex items-start gap-3">
                        <div className="theme-link-mark mt-0.5">
                          <Link2 size={17} />
                        </div>

                        <div className="min-w-0">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="theme-link inline-flex max-w-full items-center gap-1.5 text-sm font-semibold"
                          >
                            <span className="truncate">
                              {link.shortCode || "Short link"}
                            </span>
                            <ExternalLink size={12} className="theme-ink-muted shrink-0" />
                          </a>

                          <p
                            title={link.originalUrl}
                            className="theme-ink-muted mt-1 max-w-[280px] truncate text-xs"
                          >
                            {link.originalUrl}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="theme-ink text-sm font-medium tabular-nums">
                        {(link.visits ?? link.clicks ?? 0).toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="theme-ink-secondary px-5 py-4 text-sm">
                      {formatDate(link.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(link)}
                          title="Copy short URL"
                          aria-label="Copy short URL"
                          className="theme-icon-button"
                        >
                          {copiedId === (link.id || link._id || link.shortCode)
                            ? <span className="text-[10px] font-bold">OK</span>
                            : <Copy size={15} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => onShowQr?.(link)}
                          title="Show QR code"
                          aria-label="Show QR code"
                          className="theme-icon-button"
                        >
                          <QrCode size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete?.(link)}
                          title="Delete link"
                          aria-label="Delete link"
                          className="theme-icon-button theme-icon-button-danger"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      {links.length > 0 && (
        <div className="theme-divider flex items-center border-t px-5 py-3.5 sm:px-6">
          <p className="theme-ink-muted text-xs">
            {links.length} {links.length === 1 ? "link" : "links"}
          </p>
        </div>
      )}
    </section>
  );
}

export default LinksTable;

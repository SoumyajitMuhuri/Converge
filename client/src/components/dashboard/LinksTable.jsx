import { useState } from "react";
import {
  ArrowUpRight,
  Copy,
  ExternalLink,
  Link2,
  MoreHorizontal,
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
      setCopiedId(link.id);

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
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-100/60">
      {/* Table heading */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Your links</h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage and track your shortened URLs.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          View all
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Responsive table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Link
              </th>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Visits
              </th>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Created
              </th>
              <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {links.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Link2 size={22} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No links yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Shorten your first URL to see it here.
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
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* Link details */}
                    <td className="max-w-[360px] px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <Link2 size={17} />
                        </div>

                        <div className="min-w-0">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex max-w-full items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-900"
                          >
                            <span className="truncate">
                              {link.shortCode || "Short link"}
                            </span>
                            <ExternalLink
                              size={12}
                              className="shrink-0 text-slate-400"
                            />
                          </a>

                          <p
                            title={link.originalUrl}
                            className="mt-1 max-w-[280px] truncate text-xs text-slate-400"
                          >
                            {link.originalUrl}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Visit count */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {(link.visits ?? link.clicks ?? 0).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                        <span className="hidden rounded-md bg-emerald-50 px-1.5 py-1 text-[10px] font-semibold text-emerald-700 xl:inline">
                          <ArrowUpRight size={11} className="inline" /> Visits
                        </span>
                      </div>
                    </td>

                    {/* Creation date */}
                    <td className="px-5 py-4 text-xs font-medium text-slate-500">
                      {formatDate(link.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(link)}
                          title="Copy short URL"
                          aria-label="Copy short URL"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-700"
                        >
                          {copiedId === link.id ? (
                            <span className="text-[10px] font-bold">OK</span>
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onShowQr?.(link)}
                          title="Show QR code"
                          aria-label="Show QR code"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-700"
                        >
                          <QrCode size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete?.(link)}
                          title="Delete link"
                          aria-label="Delete link"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          type="button"
                          title="More options"
                          aria-label="More options"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreHorizontal size={16} />
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
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">{links.length}</span>{" "}
            {links.length === 1 ? "link" : "links"}
          </p>

          <span className="text-xs font-medium text-slate-400">
            Latest links
          </span>
        </div>
      )}
    </section>
  );
}

export default LinksTable;
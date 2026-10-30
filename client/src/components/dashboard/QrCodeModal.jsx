import { useEffect, useRef, useState } from "react";
import { Download, Share2, X } from "lucide-react";
import { api } from "../../services/api";

async function fetchQrFile(url, fileName) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to retrieve the QR code image.");

  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || "image/png" });
}

function QrCodeModal({ link, onClose }) {
  const dialogRef = useRef(null);
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!link || !dialog || dialog.open) return undefined;

    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [link]);

  if (!link) return null;

  const fileName = `converge-${link.shortCode || "qr-code"}.png`;

  const handleShare = async () => {
    setWorking(true);
    setMessage("");

    try {
      if (navigator.share) {
        let qrFile;

        try {
          qrFile = await fetchQrFile(link.qrCodeUrl, fileName);
        } catch {
          // Fall back to sharing the short URL when the image host blocks fetch.
        }

        if (qrFile && navigator.canShare?.({ files: [qrFile] })) {
          await navigator.share({
            title: `QR code for ${link.shortCode || "your link"}`,
            files: [qrFile],
          });
          setMessage("QR code shared.");
        } else {
          await navigator.share({
            title: `QR code for ${link.shortCode || "your link"}`,
            text: link.shortUrl || link.shortCode || "",
            url: link.shortUrl || link.qrCodeUrl,
          });
          setMessage("Short link shared.");
        }
      } else {
        await navigator.clipboard.writeText(link.shortUrl || link.qrCodeUrl);
        setMessage("Short link copied to clipboard.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessage("Sharing is unavailable in this browser.");
      }
    } finally {
      setWorking(false);
    }
  };

  const handleDownload = async () => {
    setWorking(true);
    setMessage("");

    try {
      const qrBlob = await api.downloadQr(link.id || link._id);
      const objectUrl = URL.createObjectURL(qrBlob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setMessage("QR code downloaded.");
    } catch (error) {
      setMessage(error.message || "Unable to download the QR code.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="qr-modal theme-surface"
      aria-labelledby="qr-modal-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="p-5 sm:p-6">
        <div className="theme-divider flex items-start justify-between gap-4 border-b pb-4">
          <div className="min-w-0">
            <h2 id="qr-modal-title" className="theme-ink text-lg font-semibold">
              QR code
            </h2>
            <p className="theme-ink-secondary mt-1 truncate text-sm">
              {link.shortCode || link.shortUrl}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close QR code"
            className="theme-icon-button shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-5 text-center">
          <div className="mx-auto flex h-64 w-64 max-w-full items-center justify-center rounded-lg border border-[var(--border)] bg-white p-3">
            <img
              src={link.qrCodeUrl}
              alt={`QR code for ${link.shortCode || "your link"}`}
              className="h-full w-full object-contain"
            />
          </div>
          {link.shortUrl && (
            <p className="theme-ink-secondary mt-3 break-all text-sm">
              {link.shortUrl}
            </p>
          )}
        </div>

        {message && (
          <p role="status" className="theme-ink-secondary mb-4 text-center text-xs">
            {message}
          </p>
        )}

        <div className="theme-divider flex gap-3 border-t pt-4">
          <button
            type="button"
            onClick={handleShare}
            disabled={working}
            className="theme-secondary-button flex-1"
          >
            <Share2 size={16} aria-hidden="true" />
            Share
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={working}
            className="theme-primary-button flex-1"
          >
            <Download size={16} aria-hidden="true" />
            Download
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default QrCodeModal;

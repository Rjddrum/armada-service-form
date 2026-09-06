import { useState } from "react";
import { X } from "lucide-react";
import { ConfirmPair, TextField } from "@/components/ui/fields";
import { useInspection } from "@/lib/inspection/store";
import { formatMiles, formatStamp } from "@/lib/utils";
import { isDraftStarted } from "@/lib/inspection/types";

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useInspection((s) => s.settings);
  const setSettings = useInspection((s) => s.setSettings);
  const archive = useInspection((s) => s.archive);
  const startNew = useInspection((s) => s.startNew);
  const restoreArchive = useInspection((s) => s.restoreArchive);
  const clearArchives = useInspection((s) => s.clearArchives);
  const clearMaint = useInspection((s) => s.clearMaint);
  const draft = useInspection((s) => s.draft);
  const [confirm, setConfirm] = useState<null | "new" | "maint" | "archives">(null);

  if (!open) return null;

  function onStartNew() {
    if (isDraftStarted(draft)) {
      setConfirm("new");
      return;
    }
    startNew();
    onClose();
  }

  return (
    <div className="overlay-frame flex flex-col bg-background/80 backdrop-blur-sm">
      <button type="button" className="min-h-16 flex-1" aria-label="Close settings" onClick={onClose} />
      <div className="sheet-panel overflow-y-auto rounded-t-xl border-t border-border bg-raised p-4 pb-8 shadow-border">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button type="button" onClick={onClose} className="tap-56 grid place-items-center" aria-label="Close">
            <X className="size-6" />
          </button>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Email goes out through Resend when you submit. Put the API key in Secrets. PDF still generates if
            email is not set up.
          </p>
          <TextField
            label="To email"
            value={settings.toEmail}
            onChange={(v) => setSettings({ toEmail: v })}
            placeholder="shop@example.com"
          />
          <TextField
            label="CC"
            value={settings.ccEmail}
            onChange={(v) => setSettings({ ccEmail: v })}
          />
          {confirm === "new" ? (
            <div className="space-y-2 rounded border border-fail bg-fail-dim p-3">
              <p className="text-sm font-medium text-foreground">Archive this draft and start a new inspection?</p>
              <ConfirmPair
                confirmLabel="Start new"
                onCancel={() => setConfirm(null)}
                onConfirm={() => {
                  startNew();
                  setConfirm(null);
                  onClose();
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartNew}
              className="tap-56 w-full rounded border border-border bg-inset font-semibold"
            >
              Start new inspection
            </button>
          )}
          {confirm === "maint" ? (
            <div className="space-y-2 rounded border border-fail bg-fail-dim p-3">
              <p className="text-sm font-medium text-foreground">Clear the maintenance log for this truck? Inspections stay.</p>
              <ConfirmPair
                confirmLabel="Clear log"
                onCancel={() => setConfirm(null)}
                onConfirm={() => {
                  clearMaint();
                  setConfirm(null);
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirm("maint")}
              className="tap-56 w-full rounded border border-border bg-inset font-semibold text-fail"
            >
              Clear maintenance log
            </button>
          )}
          <div className="pt-2">
            <p className="traveler-stamp mb-2 text-xs text-faint">Last 10 drafts</p>
            {archive.length === 0 ? (
              <p className="text-sm text-muted-foreground">No archived drafts yet.</p>
            ) : (
              <ul className="space-y-2">
                {archive.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        restoreArchive(a.id);
                        onClose();
                      }}
                      className="tap-56 w-full rounded border border-border bg-inset px-3 py-2 text-left text-sm"
                    >
                      <span className="block font-medium">
                        {a.header.date || "No date"} · {formatMiles(a.header.miles) || "—"} mi
                      </span>
                      <span className="text-muted-foreground">
                        {a.header.inspector || "No inspector"} · {formatStamp(a.updatedAt)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {archive.length > 0 ? (
              confirm === "archives" ? (
                <div className="mt-3 space-y-2 rounded border border-fail bg-fail-dim p-3">
                  <p className="text-sm font-medium text-foreground">Clear archived drafts?</p>
                  <ConfirmPair
                    confirmLabel="Clear"
                    onCancel={() => setConfirm(null)}
                    onConfirm={() => {
                      clearArchives();
                      setConfirm(null);
                    }}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirm("archives")}
                  className="tap-56 mt-3 w-full rounded border border-border font-semibold text-fail"
                >
                  Clear archives
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

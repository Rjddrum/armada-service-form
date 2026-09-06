import { Check } from "lucide-react";
import { useInspection } from "@/lib/inspection/store";
import { isDraftStarted } from "@/lib/inspection/types";

const EMAIL_COPY: Record<string, string> = {
  sent: "PDF emailed.",
  skipped: "No To address — email skipped. PDF is on this phone.",
  unconfigured: "Resend is not set up. PDF is on this phone. Add the API key in Secrets when you want mail.",
  failed: "Email failed. PDF is on this phone.",
  idle: "PDF is on this phone.",
};

export function SuccessOverlay() {
  const open = useInspection((s) => s.successOpen);
  const status = useInspection((s) => s.lastEmailStatus);
  const err = useInspection((s) => s.lastEmailError);
  const keepEditing = useInspection((s) => s.keepEditing);
  const startNew = useInspection((s) => s.startNew);
  const draft = useInspection((s) => s.draft);

  if (!open) return null;

  return (
    <div className="overlay-frame grid place-items-center bg-background/90 p-6 backdrop-blur-sm">
      <div className="hud-card w-full max-w-md space-y-4">
        <div className="grid size-14 place-items-center rounded bg-pass-dim text-pass">
          <Check className="size-8" strokeWidth={3} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Inspection submitted</h2>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {EMAIL_COPY[status] ?? EMAIL_COPY.idle}
          {status === "failed" && err ? ` ${err}` : ""}
        </p>
        <button
          type="button"
          onClick={keepEditing}
          className="tap-44 w-full rounded bg-primary font-mono text-sm font-semibold tracking-widest uppercase text-primary-foreground"
        >
          Keep editing
        </button>
        <button
          type="button"
          onClick={() => {
            if (isDraftStarted(draft) && !window.confirm("Archive this draft and start a new inspection?")) return;
            startNew();
          }}
          className="tap-44 w-full rounded border border-border bg-inset font-medium"
        >
          Start new
        </button>
      </div>
    </div>
  );
}

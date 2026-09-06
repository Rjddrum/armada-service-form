import { useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import { useInspection } from "@/lib/inspection/store";
import { blobToDataUrl, deleteVoice, loadVoice, saveVoice, type VoiceClip } from "@/lib/inspection/voice";
import { setRowNotes, rowNotes } from "@/lib/inspection/status";
import { transcribeIfNeeded } from "@/lib/inspection/grok-scan-client";
import { appendNote } from "@/lib/inspection/grok-scan";
import { cn } from "@/lib/utils";

type SpeechRec = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function speechEngine(): SpeechRec | null {
  const Ctor = (window as unknown as { webkitSpeechRecognition?: new () => SpeechRec; SpeechRecognition?: new () => SpeechRec })
    .SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRec }).webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";
  return rec;
}

export function VoiceNote({ rowId }: { rowId: string }) {
  const draftId = useInspection((s) => s.draft.id);
  const patch = useInspection((s) => s.patch);
  const touchSave = useInspection((s) => s.touchSave);
  const [clip, setClip] = useState<VoiceClip | null>(null);
  const [holding, setHolding] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const started = useRef(0);
  const speechRef = useRef<SpeechRec | null>(null);
  const transcript = useRef("");

  useEffect(() => {
    let live = true;
    void loadVoice(draftId, rowId).then((c) => {
      if (live) setClip(c);
    });
    return () => {
      live = false;
    };
  }, [draftId, rowId]);

  async function startHold() {
    if (holding) return;
    transcript.current = "";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.current.push(e.data);
      };
      rec.start();
      recRef.current = rec;
      started.current = Date.now();
      setHolding(true);
      const speech = speechEngine();
      if (speech) {
        speech.onresult = (ev) => {
          const last = ev.results[ev.results.length - 1];
          if (last) transcript.current = last[0].transcript.trim();
        };
        speech.onerror = () => undefined;
        try {
          speech.start();
        } catch {
          /* already started */
        }
        speechRef.current = speech;
      }
    } catch {
      setHolding(false);
    }
  }

  async function stopHold() {
    const rec = recRef.current;
    recRef.current = null;
    setHolding(false);
    speechRef.current?.stop();
    speechRef.current = null;
    if (!rec) return;
    await new Promise<void>((resolve) => {
      rec.onstop = () => resolve();
      if (rec.state !== "inactive") rec.stop();
      else resolve();
    });
    rec.stream.getTracks().forEach((t) => t.stop());
    const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
    if (blob.size < 200) return;
    try {
      const dataUrl = await blobToDataUrl(blob);
      const next: VoiceClip = {
        id: `${rowId}-${Date.now()}`,
        rowId,
        dataUrl,
        durationMs: Date.now() - started.current,
        transcript: transcript.current,
        createdAt: Date.now(),
      };
      await saveVoice(draftId, next);
      setClip(next);
      let spoken = next.transcript;
      if (!spoken) {
        spoken = await transcribeIfNeeded(next.dataUrl);
        if (spoken) {
          next.transcript = spoken;
          setClip({ ...next, transcript: spoken });
        }
      }
      if (spoken) {
        patch((d) => {
          setRowNotes(d, rowId, appendNote(rowNotes(d, rowId), spoken));
        });
      }
      touchSave();
      useInspection.getState().flushPersist();
    } catch {
      useInspection.getState().setSaveError("Could not save — free space or export PDF now.");
    }
  }

  return (
    <div className="space-y-2">
      <p className="field-label">Voice note</p>
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          void startHold();
        }}
        onPointerUp={() => void stopHold()}
        onPointerCancel={() => void stopHold()}
        onPointerLeave={() => holding && void stopHold()}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          "tap-56 flex w-full touch-none select-none items-center justify-center gap-2 rounded border font-semibold",
          holding ? "border-fail bg-fail text-foreground" : "border-border bg-raised text-foreground",
        )}
      >
        {holding ? <Square className="size-5" /> : <Mic className="size-5" />}
        {holding ? "Release to save" : "Hold to record"}
      </button>
      {clip ? (
        <div className="space-y-2 rounded border border-border bg-inset p-3">
          <audio src={clip.dataUrl} controls className="w-full" />
          {clip.transcript ? <p className="text-sm text-foreground">{clip.transcript}</p> : null}
          {confirm ? (
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="tap-56 rounded border border-border bg-raised font-medium" onClick={() => setConfirm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="tap-56 rounded bg-fail font-semibold text-foreground"
                onClick={() => {
                  void deleteVoice(draftId, rowId).then(() => setClip(null));
                  setConfirm(false);
                  touchSave();
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirm(true)} className="tap-56 inline-flex w-full items-center justify-center gap-1 rounded border border-border font-medium">
              <Trash2 className="size-4" />
              Delete voice note
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

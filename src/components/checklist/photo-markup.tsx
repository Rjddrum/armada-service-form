import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Circle, Pencil, Undo2, X } from "lucide-react";
import type { PhotoShot } from "@/lib/inspection/photos";
import { cn } from "@/lib/utils";

type Tool = "circle" | "freehand" | "arrow";

interface Stroke {
  tool: Tool;
  points: { x: number; y: number }[];
}

const STROKE = "#5ad4c6";

function drawArrow(ctx: CanvasRenderingContext2D, a: { x: number; y: number }, b: { x: number; y: number }) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const len = 18;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - len * Math.cos(ang - 0.4), b.y - len * Math.sin(ang - 0.4));
  ctx.lineTo(b.x - len * Math.cos(ang + 0.4), b.y - len * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
}

function paintStrokes(ctx: CanvasRenderingContext2D, strokes: Stroke[], w: number, h: number) {
  ctx.lineWidth = Math.max(3, Math.round(Math.min(w, h) / 90));
  ctx.strokeStyle = STROKE;
  ctx.fillStyle = STROKE;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const s of strokes) {
    const pts = s.points.map((p) => ({ x: p.x * w, y: p.y * h }));
    if (pts.length < 2) continue;
    if (s.tool === "circle") {
      const a = pts[0]!;
      const b = pts[pts.length - 1]!;
      ctx.beginPath();
      ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (s.tool === "arrow") {
      drawArrow(ctx, pts[0]!, pts[pts.length - 1]!);
    } else {
      ctx.beginPath();
      ctx.moveTo(pts[0]!.x, pts[0]!.y);
      for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i]!.x, pts[i]!.y);
      ctx.stroke();
    }
  }
}

export function PhotoMarkup({
  shot,
  onSave,
  onCancel,
}: {
  shot: PhotoShot;
  onSave: (next: PhotoShot) => void;
  onCancel: () => void;
}) {
  const src = shot.originalDataUrl || shot.dataUrl;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [tool, setTool] = useState<Tool>("circle");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [caption, setCaption] = useState(shot.caption ?? "");
  const drawing = useRef<Stroke | null>(null);

  function redraw() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const live = drawing.current ? [...strokes, drawing.current] : strokes;
    paintStrokes(ctx, live, canvas.width, canvas.height);
  }

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      redraw();
    };
    img.src = src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, tool]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = { tool, points: [pos(e)] };
  }
  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    drawing.current.points.push(pos(e));
    redraw();
  }
  function onUp() {
    if (drawing.current && drawing.current.points.length >= 2) {
      setStrokes((s) => [...s, drawing.current!]);
    }
    drawing.current = null;
    redraw();
  }

  function save() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.72);
    onSave({
      dataUrl,
      originalDataUrl: src,
      w: canvas.width,
      h: canvas.height,
      caption: caption.trim(),
    });
  }

  return (
    <div className="overlay-frame z-[60] flex flex-col bg-background">
      <div className="flex items-center justify-between gap-2 px-3 pt-3">
        <p className="traveler-stamp text-xs text-primary">Mark the problem</p>
        <button type="button" className="tap-56 grid place-items-center" onClick={onCancel} aria-label="Close markup">
          <X className="size-6" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-3 py-2">
        <canvas
          ref={canvasRef}
          className="mx-auto block max-h-full w-full touch-none rounded border border-border"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </div>
      <div className="space-y-2 border-t border-border px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "circle" as const, label: "Circle", Icon: Circle },
              { id: "freehand" as const, label: "Draw", Icon: Pencil },
              { id: "arrow" as const, label: "Arrow", Icon: ArrowUpRight },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              className={cn("tap-56 inline-flex items-center gap-1 rounded border px-3 text-sm font-semibold", tool === t.id ? "chip-on" : "chip-off")}
            >
              <t.Icon className="size-4" />
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStrokes((s) => s.slice(0, -1))}
            className="tap-56 inline-flex items-center gap-1 rounded border border-border px-3 text-sm font-semibold"
          >
            <Undo2 className="size-4" />
            Undo
          </button>
        </div>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="One-line caption — what to look at"
          className="field-input"
        />
        <button type="button" onClick={save} className="tap-56 w-full rounded bg-primary font-semibold text-primary-foreground">
          Save marked photo
        </button>
      </div>
    </div>
  );
}

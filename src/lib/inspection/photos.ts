export interface PhotoShot {
  dataUrl: string;
  originalDataUrl?: string;
  w: number;
  h: number;
  caption?: string;
}

const DB_NAME = "armada-inspection-photos-v1";
const STORE = "photos";
const MAX_EDGE = 960;
const QUALITY = 0.62;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("no indexedDB"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbKey(draftId: string, slot: string) {
  return `${draftId}:${slot}`;
}

export async function compressPhoto(file: File): Promise<PhotoShot> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file, {
      imageOrientation: "from-image" as ImageBitmapOptions["imageOrientation"],
    });
  } catch {
    bmp = await createImageBitmap(file);
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bmp.close();
    throw new Error("no canvas");
  }
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
  return { dataUrl, w, h };
}

export async function loadPhotos(draftId: string): Promise<Record<string, PhotoShot>> {
  const out: Record<string, PhotoShot> = {};
  if (!draftId) return out;
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const store = tx.objectStore(STORE);
      const prefix = `${draftId}:`;
      const range = IDBKeyRange.bound(prefix, `${prefix}\uffff`);
      const req = store.openCursor(range);
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) {
          resolve();
          return;
        }
        const key = String(cursor.key);
        const value = cursor.value as PhotoShot | PhotoShot[];
        if (Array.isArray(value)) {
          const first = value[0];
          if (first?.dataUrl) out[key.slice(prefix.length)] = first;
        } else if (value?.dataUrl) {
          out[key.slice(prefix.length)] = value;
        }
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    /* private mode */
  }
  return out;
}

export async function putPhoto(draftId: string, slot: string, shot: PhotoShot) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).put(shot, idbKey(draftId, slot));
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    /* ignore */
  }
}

export async function deletePhoto(draftId: string, slot: string) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).delete(idbKey(draftId, slot));
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    /* ignore */
  }
}

export async function prunePhotos(keepDraftIds: string[]) {
  const keep = new Set(keepDraftIds.filter(Boolean));
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) {
          resolve();
          return;
        }
        const draftId = String(cursor.key).split(":")[0] ?? "";
        if (!keep.has(draftId)) cursor.delete();
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    /* ignore */
  }
}

export async function clearAllPhotos() {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    /* ignore */
  }
}

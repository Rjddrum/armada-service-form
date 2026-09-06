/**
 * iOS Safari / installed-PWA leftover-keyboard fix.
 *
 * After an input blurs, WebKit often keeps the layout viewport (and
 * visualViewport.height) at the keyboard-open size. The traveler then sits in
 * the top half of the screen with a dead gap where the keyboard was.
 *
 * We size `.app-frame` from the visual viewport while a field is focused, and
 * snap back to the last full-screen height the moment nothing is focused —
 * even if Safari still reports the shrunk number.
 */

const KEYBOARD_GAP_PX = 80;

function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el instanceof HTMLInputElement) {
    if (el.readOnly || el.disabled) return false;
    const skip = new Set([
      "button",
      "checkbox",
      "radio",
      "submit",
      "reset",
      "file",
      "hidden",
      "image",
      "range",
      "color",
    ]);
    return !skip.has(el.type);
  }
  if (el instanceof HTMLTextAreaElement) return !el.readOnly && !el.disabled;
  if (el instanceof HTMLSelectElement) return !el.disabled;
  return el.isContentEditable;
}

function measureViewport(): { height: number; offsetTop: number } {
  const vv = window.visualViewport;
  if (vv && vv.height > 0) {
    return { height: vv.height, offsetTop: vv.offsetTop };
  }
  return { height: window.innerHeight, offsetTop: 0 };
}

function zeroDocumentScroll() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function installViewportLock(): () => void {
  const root = document.documentElement;
  let fullHeight = Math.max(window.innerHeight, measureViewport().height);
  const timeouts: number[] = [];

  const apply = () => {
    const { height, offsetTop } = measureViewport();
    const focused = isEditable(document.activeElement);
    const keyboardOpen = focused && fullHeight - height > KEYBOARD_GAP_PX;

    if (keyboardOpen) {
      root.style.setProperty("--app-height", `${Math.round(height)}px`);
      root.style.setProperty("--app-top", `${Math.round(offsetTop)}px`);
      root.classList.add("keyboard-open");
      return;
    }

    if (!focused) {
      fullHeight = Math.max(fullHeight, height, window.innerHeight);
      root.classList.remove("keyboard-open");
      root.style.setProperty("--app-height", `${Math.round(fullHeight)}px`);
      root.style.setProperty("--app-top", "0px");
      zeroDocumentScroll();
      return;
    }

    // Focused, but viewport has not actually shrunk yet (keyboard animating in).
    root.style.setProperty("--app-height", `${Math.round(height)}px`);
    root.style.setProperty("--app-top", `${Math.round(offsetTop)}px`);
  };

  const restoreSoon = () => {
    apply();
    requestAnimationFrame(apply);
    for (const ms of [50, 160, 320, 500]) {
      timeouts.push(window.setTimeout(apply, ms));
    }
  };

  const resetFull = () => {
    fullHeight = Math.max(window.innerHeight, measureViewport().height);
    restoreSoon();
  };

  const onFocusIn = (e: Event) => {
    apply();
    const el = e.target;
    if (!(el instanceof HTMLElement) || !isEditable(el)) return;
    timeouts.push(
      window.setTimeout(() => {
        el.scrollIntoView({ block: "center", inline: "nearest" });
      }, 300),
    );
  };

  const onFocusOut = () => {
    restoreSoon();
  };

  const onVisibility = () => {
    if (document.visibilityState === "visible") restoreSoon();
  };

  const vv = window.visualViewport;
  vv?.addEventListener("resize", apply);
  vv?.addEventListener("scroll", apply);
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", resetFull);
  window.addEventListener("pageshow", restoreSoon);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  document.addEventListener("visibilitychange", onVisibility);

  const vk = (
    navigator as Navigator & {
      virtualKeyboard?: { overlaysContent: boolean };
    }
  ).virtualKeyboard;
  if (vk) vk.overlaysContent = true;

  apply();

  return () => {
    for (const id of timeouts) window.clearTimeout(id);
    vv?.removeEventListener("resize", apply);
    vv?.removeEventListener("scroll", apply);
    window.removeEventListener("resize", apply);
    window.removeEventListener("orientationchange", resetFull);
    window.removeEventListener("pageshow", restoreSoon);
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

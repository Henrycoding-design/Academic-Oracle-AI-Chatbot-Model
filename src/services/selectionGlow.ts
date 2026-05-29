const SELECTION_HIGHLIGHT_NAME = "oracle-selection-glow";
const SELECTION_HIGHLIGHT_STYLE_ID = "oracle-selection-highlight-style";
const SELECTION_FALLBACK_CLASS = "oracle-selection-bubble-glow";

let clearSelectionGlowTimeout: number | null = null;

const normalizeWhitespace = (text: string) => text.replace(/\s+/g, " ").trim();

const ensureSelectionHighlightStyle = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(SELECTION_HIGHLIGHT_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = SELECTION_HIGHLIGHT_STYLE_ID;
  style.textContent = `
    ::highlight(${SELECTION_HIGHLIGHT_NAME}) {
      background: rgba(168, 85, 247, 0.18);
      box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.18);
      text-shadow: 0 0 12px rgba(192, 132, 252, 0.45);
      color: inherit;
    }

    .${SELECTION_FALLBACK_CLASS} {
      box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.18), 0 0 18px rgba(168, 85, 247, 0.14);
      transition: box-shadow 180ms ease;
    }
  `;
  document.head.appendChild(style);
};

const findSelectionRange = (container: HTMLElement, selectionText: string): Range | null => {
  const normalizedQuery = normalizeWhitespace(selectionText);
  if (!normalizedQuery) return null;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const chars: Array<{ node: Text; offset: number }> = [];
  let normalizedText = "";
  let previousWasWhitespace = true;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const value = node.textContent ?? "";

    for (let i = 0; i < value.length; i += 1) {
      const char = value[i];
      const isWhitespace = /\s/.test(char);

      if (isWhitespace) {
        if (!previousWasWhitespace && normalizedText.length > 0) {
          normalizedText += " ";
          chars.push({ node, offset: i });
          previousWasWhitespace = true;
        }
        continue;
      }

      normalizedText += char;
      chars.push({ node, offset: i });
      previousWasWhitespace = false;
    }
  }

  const startIndex = normalizedText.indexOf(normalizedQuery);
  if (startIndex === -1) return null;

  const endIndex = startIndex + normalizedQuery.length - 1;
  const start = chars[startIndex];
  const end = chars[endIndex];
  if (!start || !end) return null;

  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset + 1);
  return range;
};

export const flashSelectionGlow = (targetMessageId: string, selectionText: string) => {
  const target = document.getElementById(targetMessageId) as HTMLElement | null;
  if (!target) return;

  ensureSelectionHighlightStyle();
  target.scrollIntoView({ behavior: "smooth", block: "center" });

  if (clearSelectionGlowTimeout != null) {
    window.clearTimeout(clearSelectionGlowTimeout);
    clearSelectionGlowTimeout = null;
  }

  const highlightRegistry = (CSS as any)?.highlights;
  const HighlightCtor = (window as any).Highlight;
  const range = findSelectionRange(target, selectionText);

  if (highlightRegistry && HighlightCtor && range) {
    highlightRegistry.delete(SELECTION_HIGHLIGHT_NAME);
    highlightRegistry.set(SELECTION_HIGHLIGHT_NAME, new HighlightCtor(range));

    clearSelectionGlowTimeout = window.setTimeout(() => {
      highlightRegistry.delete(SELECTION_HIGHLIGHT_NAME);
      clearSelectionGlowTimeout = null;
    }, 1500);

    return;
  }

  target.classList.remove(SELECTION_FALLBACK_CLASS);
  void target.offsetWidth;
  target.classList.add(SELECTION_FALLBACK_CLASS);

  clearSelectionGlowTimeout = window.setTimeout(() => {
    target.classList.remove(SELECTION_FALLBACK_CLASS);
    clearSelectionGlowTimeout = null;
  }, 1500);
};

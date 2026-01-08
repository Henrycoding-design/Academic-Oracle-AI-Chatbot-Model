import React, { useEffect } from "react";

export function useClickOutside(
  refs: React.RefObject<HTMLElement>[],
  onClose: () => void,
  enabled: boolean
){
  useEffect(() => {
    if (!enabled) return;

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;

      const clickedInside = refs.some(
        ref => ref.current && ref.current.contains(target)
      );

      if (!clickedInside) onClose();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [refs, onClose, enabled]);
}

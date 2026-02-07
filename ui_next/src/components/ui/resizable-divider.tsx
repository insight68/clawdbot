"use client";

import { useEffect, useRef, useState } from "react";

interface ResizableDividerProps {
  splitRatio: number;
  minRatio?: number;
  maxRatio?: number;
  onResize: (splitRatio: number) => void;
  className?: string;
}

/**
 * 可拖动调整大小的分割线组件
 * 从 ui_lit/src/ui/components/resizable-divider.ts 迁移到 React
 */
export function ResizableDivider({
  splitRatio,
  minRatio = 0.4,
  maxRatio = 0.7,
  onResize,
  className = "",
}: ResizableDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startRatioRef = useRef(0);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startRatioRef.current = splitRatio;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const container = dividerRef.current?.parentElement;
    if (!container) return;

    const containerWidth = container.getBoundingClientRect().width;
    const deltaX = e.clientX - startXRef.current;
    const deltaRatio = deltaX / containerWidth;

    let newRatio = startRatioRef.current + deltaRatio;
    newRatio = Math.max(minRatio, Math.min(maxRatio, newRatio));

    onResize(newRatio);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const divider = dividerRef.current;
    if (!divider) return;

    divider.addEventListener("mousedown", handleMouseDown as EventListener);
    return () => {
      divider.removeEventListener("mousedown", handleMouseDown as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={dividerRef}
      className={`resizable-divider ${isDragging ? "dragging" : ""} ${className}`.trim()}
      style={{
        width: "4px",
        cursor: "col-resize",
        background: "var(--border, #333)",
        transition: "background 150ms ease-out",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <style>{`
        .resizable-divider::before {
          content: "";
          position: absolute;
          top: 0;
          left: -4px;
          right: -4px;
          bottom: 0;
        }
        .resizable-divider:hover {
          background: var(--accent, #007bff);
        }
        .resizable-divider.dragging {
          background: var(--accent, #007bff);
        }
      `}</style>
    </div>
  );
}

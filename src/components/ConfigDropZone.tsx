import React, { PropsWithChildren } from "react";
import { loadConfig } from "./UploadButton";
import { useNavigate } from "react-router-dom";

export function ConfigDropZone({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!event.dataTransfer.items) return;
    const item = event.dataTransfer.items[0];
    if (item.kind !== 'file') return;
    const file = item.getAsFile();
    try {
      loadConfig(navigate, file);
    } catch (error: any) {
      return
    }
  }

  return <div className="configDropZone" onDrop={onDrop} onDragOver={onDragOver}>
    {children}
  </div>;
}

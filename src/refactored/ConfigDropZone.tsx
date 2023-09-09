import React, { useState, ReactNode } from "react";
import { loadConfig } from "./UploadButton";
import { useNavigate } from "react-router-dom";

export function ConfigDropZone({ children }: { children: ReactNode }) {
  const defaultText = '';
  const defaultClass = 'ConfigDropZone';
  const [className, setClassName] = useState(defaultClass);
  const [text, setText] = useState(defaultText);
  const navigate = useNavigate();

  function dropError(message = 'JSON files only, please.') {
    setText(message);
    setClassName(`${defaultClass} dropZoneError`);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setClassName(`${defaultClass} dropZoneDragged`);
    setText('+');
  }

  function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setClassName(defaultClass);
    setText(defaultText);
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!event.dataTransfer.items) return dropError();
    const item = event.dataTransfer.items[0];
    if (item.kind !== 'file') return dropError();
    const file = item.getAsFile();
    loadConfig(navigate, file);
  }

  return <div className={className} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
    {text ? text : <div>
      {children}
    </div>}
  </div>;
}
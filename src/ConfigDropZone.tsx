import React, { useState } from "react";

export type StringListMap = {
  [key: string]: string[]
}

export type TableConfig = {
  title: string,
  description: string,
  link?: string,
  schemaVersion: string,
  contentVersion?: string,
  generators: StringListMap,
  tables: StringListMap
  isDefault?: boolean
}

export function ConfigDropZone({ configLoadedCallback }: { configLoadedCallback: (config: TableConfig) => void }) {
  const defaultText = 'Drag config file here.';
  const defaultClass = 'ConfigDropZone';
  const [className, setClassName] = useState(defaultClass);
  const [text, setText] = useState(defaultText);

  function dropError(message = 'JSON files only, please.') {
    setText(message);
    setClassName(`${defaultClass} dropZoneError`);
  }

  function resetDropZone() {
    setClassName(defaultClass);
    setText(defaultText);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setClassName(`${defaultClass} dropZoneDragged`);
    setText('+');
  }

  function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    resetDropZone();
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!event.dataTransfer.items) return dropError();
    const item = event.dataTransfer.items[0];
    if (item.kind !== 'file') return dropError();
    const file = item.getAsFile();
    if (file?.type !== 'application/json') return dropError();
    resetDropZone();

    const reader = new FileReader();
    reader.onload = function (event) {
      if (event.target?.result) {
        configLoadedCallback(JSON.parse(event.target.result.toString()) as TableConfig);
      }
    }
    reader.readAsText(file);
  }

  return <div className={className} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>{text}</div>;
}

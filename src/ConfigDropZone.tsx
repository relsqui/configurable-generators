import React, { useState, useRef } from "react";
import { TableConfig } from "./tableConfig";

export function UploadForm({ importConfig }: { importConfig: (file: File | null) => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  return <p>
    {/* I have no idea why this nbsp is necessary but nothing else worked. */}
    Drag config file here or&nbsp;<button onClick={() => fileInput.current?.click()}>select file</button>.
    <input
      ref={fileInput}
      className="fileInput"
      type="file"
      accept="application/json"
      onChange={(event) => importConfig((event.target.files || [])[0])}
    />
  </p>;
}

export function SelectPreset({ configLoadedCallback }: { configLoadedCallback: (config: TableConfig) => void }) {
  // https://webpack.js.org/guides/dependency-management/#require-context
  const requirePresets = require.context('./static/presets/', true, /\.json$/);
  const presets: { [key: string]: TableConfig } = {};
  for (const presetFile of requirePresets.keys()) {
    const preset = requirePresets(presetFile);
    presets[preset.title] = preset;
  }

  function selectPreset(event: React.ChangeEvent<HTMLSelectElement>) {
    const presetTitle = event.target.value;
    if (presets[presetTitle]) {
      configLoadedCallback(presets[presetTitle]);
    }
  }

  return <p>
    Or choose a preset: <select value="" onChange={selectPreset}>
      <option></option>
      {Object.keys(presets).map(presetTitle => <option key={presetTitle} value={presetTitle}>{presetTitle}</option>)}
    </select>
  </p>;
}

export function ConfigDropZone({ configLoadedCallback }: { configLoadedCallback: (config: TableConfig) => void }) {
  const defaultText = '';
  const defaultClass = 'ConfigDropZone';
  const [className, setClassName] = useState(defaultClass);
  const [text, setText] = useState(defaultText);

  function dropError(message = 'JSON files only, please.') {
    setText(message);
    setClassName(`${defaultClass} dropZoneError`);
  }

  function importConfig(file: File | null) {
    if (file?.type !== 'application/json') return dropError();
    const reader = new FileReader();
    reader.onload = function (event) {
      if (event.target?.result) {
        configLoadedCallback(JSON.parse(event.target.result.toString()) as TableConfig);
      }
    };
    reader.readAsText(file);
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
    importConfig(file);
  }

  return <div className={className} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
    {text ? text : <div>
      <UploadForm importConfig={importConfig} />
      <SelectPreset configLoadedCallback={configLoadedCallback} />
    </div>}
  </div>;
}

import { useRef } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { TableConfig } from '../tableConfig';
import { titleToSlug } from '../presets';

export function loadConfig(navigate: NavigateFunction, file: File | null) {
  if (file?.type !== 'application/json') throw new Error('JSON files only, please.');
  const reader = new FileReader();
  reader.onload = function (event) {
    if (event.target?.result) {
      const config = JSON.parse(event.target.result.toString()) as TableConfig;
      const slug = titleToSlug(config.title);
      localStorage.setItem(slug, JSON.stringify(config));
      navigate(`local/${slug}`);
    }
  };
  reader.readAsText(file);
}

export default function UploadButton() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  return <div className="uploadButton">
    Drag a config file here or <button onClick={() => fileInput.current?.click()}>upload file</button>
    <input
      ref={fileInput}
      className="fileInput"
      type="file"
      accept="application/json"
      onChange={(event) => loadConfig(navigate, (event.target.files || [])[0])}
    />
  </div>;
}


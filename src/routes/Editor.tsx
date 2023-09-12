import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TableConfig } from "../tableConfig";
import { NavButton } from "../components/NavButton";
import { matchSlug } from '../matchSlug';
import { Generator, GeneratorButton } from './Generator';

export function EditorHeader({ generators, selectedGenerator }: {
  generators: string[],
  selectedGenerator: string
}) {
  const navigate = useNavigate();
  return <nav><ul className='navigation'>
    {generators.map((g) => <GeneratorButton key={g} generator={g} selected={g === selectedGenerator} />)}
    <button>+</button>
    <NavButton liClassNames={['pushRight']}>Preview</NavButton>
    <NavButton>Save</NavButton>
    <NavButton>Upload</NavButton>
    <NavButton buttonProps={{ onClick: () => navigate("/") }}>Close</NavButton>
  </ul></nav>;
}

const defaultConfig: TableConfig = {
  title: "New Config",
  schemaVersion: "0.1.0",
  generators: {
    "Distraction": [
      "Look behind you! It's a <color> <animal>!"
    ],
    "Accessories": [
      "I bought a <color> collar for my pet <animal>."
    ]
  },
  tables: {
    "color": [
      "maroon",
      "chartreuse",
      "cerulean"
    ],
    "animal": [
      "dodo",
      "quagga",
      "mammoth"
    ]
  }
}

export default function Editor() {
  const [config, setConfig] = useState(defaultConfig);
  const generator = matchSlug(Object.keys(config.generators), Object.keys(config.generators)[0]);
  const [editPaneContent, setEditPaneContent] = useState(config.generators[generator].join('\n'));
  const configStorageLabel = "editingConfig";

  useEffect(() => {
    localStorage.setItem(configStorageLabel, JSON.stringify(config));
  }, [config, configStorageLabel]);

  function updateGenerator(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newConfig = { ...config };
    newConfig.generators[generator] = event.target.value.split('\n');
    setConfig(newConfig);
    setEditPaneContent(event.target.value);
  }

  return <>
    <EditorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} />
    <div className="editorContent">
      <textarea className="editPane" onChange={updateGenerator} value={editPaneContent} />
      <div className="editorPreview">
        <Generator config={config} generator={generator} textTreeStorageLabel="editingTextTree" />
      </div>
    </div>
  </>;
}


import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
import { TableConfig } from "../tableConfig";
import { NavButton } from "../components/NavButton";
import { matchSlug } from '../matchSlug';
import { Generator, GeneratorButton } from './Generator';

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

const configStorageLabel = "editingConfig";

function storedConfigIfAvailable(configStorageLabel: string) {
  const storedConfig = localStorage.getItem(configStorageLabel);
  if (storedConfig) {
    return JSON.parse(storedConfig);
  }
  return defaultConfig;
}

export async function loader() {
  return { config: storedConfigIfAvailable(configStorageLabel) };
}

function EditorHeader({ generators, selectedGenerator }: {
  generators: string[],
  selectedGenerator: string,
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

export default function Editor() {
  let { config } = useLoaderData() as { config: TableConfig };
  const generator = matchSlug(Object.keys(config.generators), Object.keys(config.generators)[0]);
  const [editPaneContent, setEditPaneContent] = useState(config.generators[generator].join('\n'));

  useEffect(() => {
    localStorage.setItem(configStorageLabel, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    setEditPaneContent(config.generators[generator].join('\n'));
  }, [config.generators, generator]);

  function updateGenerator(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newConfig = { ...config };
    newConfig.generators[generator] = event.target.value.split('\n');
    config = newConfig;
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


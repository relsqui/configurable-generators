import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
import { TableConfig } from "../tableConfig";
import { NavButton } from "../components/NavButton";
import { matchSlug } from '../matchSlug';
import { Generator, GeneratorButton } from './Generator';
import { titleToSlug } from '../presets';

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

function EditorHeader({ generators, selectedGenerator, addGenerator }: {
  generators: string[],
  selectedGenerator: string,
  addGenerator: () => void
}) {
  const navigate = useNavigate();
  return <nav><ul className='navigation'>
    {generators.map((g) => <GeneratorButton key={g} generator={g} selected={g === selectedGenerator} />)}
    <button onClick={addGenerator}>+</button>
    <NavButton liClassNames={['pushRight']}>Preview</NavButton>
    <NavButton>Save</NavButton>
    <NavButton>Upload</NavButton>
    <NavButton buttonProps={{ onClick: () => navigate("/") }}>Close</NavButton>
  </ul></nav>;
}

export default function Editor() {
  // using the loader triggers a rerender when we change the hash for nav buttons
  const { config: loadedConfig } = useLoaderData() as { config: TableConfig };
  const [config, setConfig] = useState(loadedConfig)
  let generator = matchSlug(Object.keys(config.generators), Object.keys(config.generators)[0]);
  const [editPaneContent, setEditPaneContent] = useState(config.generators[generator].join('\n'));
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(configStorageLabel, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    setEditPaneContent(config.generators[generator].join('\n'));
  }, [config.generators, generator]);


  function updateGenerator(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newConfig = { ...config };
    newConfig.generators[generator] = event.target.value.split('\n');
    setConfig(newConfig);
    setEditPaneContent(event.target.value);
  }

  function addGenerator() {
    const newGenerator = "New Generator"
    const newGenerators = { ...config.generators, [newGenerator]: [] };
    const newConfig = { ...config, generators: newGenerators };
    setConfig(newConfig);
    navigate(`#${titleToSlug(newGenerator)}`);
  }

  function renameGenerator(event: React.ChangeEvent<HTMLInputElement>) {
    const newGenerator = event.target.value;
    const newConfig = { ...config };
    newConfig.generators[newGenerator] = newConfig.generators[generator];
    delete newConfig.generators[generator];
    generator = newGenerator;
    navigate(`#${titleToSlug(newGenerator)}`);
  }

  return <>
    <EditorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} addGenerator={addGenerator} />
    <div className="editorContent">
      <div className="editorTitle">
        <input className="editGeneratorTitle" name="generatorName" value={generator} onChange={renameGenerator} />
        <button>Delete</button>
      </div>
      <textarea className="editPane" onChange={updateGenerator} value={editPaneContent} />
      <div className="editorPreview">
        <Generator config={config} generator={generator} textTreeStorageLabel="editingTextTree" />
      </div>
    </div>
  </>;
}


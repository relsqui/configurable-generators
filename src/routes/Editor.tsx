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
    <button className="square" onClick={addGenerator}>+</button>
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
  const [selectedTable, setSelectedTable] = useState(Object.keys(config.tables)[0]);
  const [tablePaneContent, setTablePaneContent] = useState(config.tables[selectedTable].join('\n'));
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(configStorageLabel, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    setEditPaneContent(config.generators[generator].join('\n'));
  }, [config.generators, generator]);

  useEffect(() => {
    setTablePaneContent(config.tables[selectedTable].join('\n'));
  }, [config.tables, selectedTable]);


  function updateConfig(partialConfig: Partial<TableConfig>, newGenerator: string) {
    const newConfig = { ...config, ...partialConfig };
    setConfig(newConfig);
    navigate(`#${titleToSlug(newGenerator)}`);
  }

  function updateEditPane(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newConfig = { ...config };
    newConfig.generators[generator] = event.target.value.split('\n');
    setConfig(newConfig);
    setEditPaneContent(event.target.value);
  }

  function updateTableItems(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newConfig = { ...config };
    newConfig.tables[selectedTable] = event.target.value.split('\n');
    setConfig(newConfig);
    setTablePaneContent(event.target.value);
  }

  function addGenerator() {
    const newGenerator = "New Tab"
    const newGenerators = { ...config.generators, [newGenerator]: [] };
    updateConfig({ generators: newGenerators }, newGenerator);
  }

  function renameGenerator(event: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = event.target.value;
    const newGenerators = { ...config.generators, [newTitle]: config.generators[generator] };
    delete newGenerators[generator];
    updateConfig({ generators: newGenerators }, newTitle);
  }

  function deleteGenerator(event: React.MouseEvent<HTMLButtonElement>) {
    const newGenerators = { ...config.generators };
    delete newGenerators[generator];
    updateConfig({ generators: newGenerators }, Object.keys(config.generators)[0]);
  }

  return <>
    <EditorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} addGenerator={addGenerator} />
    <div className="editorContent flexRow">
      <div className="editorGenerator">
        <div className="editorTitle flexRow">
          <input className="editorItem" name="generatorName" value={generator} onChange={renameGenerator} />
          {Object.keys(config.generators).length > 1 ? <button onClick={deleteGenerator}>Delete '{generator}'</button> : ''}
        </div>
        <textarea className="editorItem" onChange={updateEditPane} value={editPaneContent} />
        <div className="editorPreview">
          <Generator config={config} generator={generator} textTreeStorageLabel="editingTextTree" />
        </div>
      </div>
      <div className="editorTable">
        <div className="tableTitle flexRow">
          <select className="editorItem editorTableSelect" defaultValue={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
            {Object.keys(config.tables).map(tableName => <option key={tableName}>{tableName}</option>)}
          </select>
          <button className="square">+</button>
        </div>
        <textarea className="editorItem" value={tablePaneContent} onChange={updateTableItems}></textarea>
      </div>
    </div>
  </>;
}


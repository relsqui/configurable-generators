import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver';
import { TableConfig } from "../tableConfig";
import { NavButton } from "../components/NavButton";
import { matchSlug } from '../matchSlug';
import { Generator, GeneratorButton } from './Generator';
import { titleToSlug } from '../presets';

const defaultConfig: TableConfig = {
  title: 'New Config Title',
  description: '',
  link: '',
  schemaVersion: '0.1.0',
  contentVersion: '',
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

function EditorHeader({ generators, selectedGenerator, saveConfig }: {
  generators: string[],
  selectedGenerator: string,
  saveConfig: () => void
}) {
  const navigate = useNavigate();
  return <nav><ul className='navigation'>
    {generators.map((g) => <GeneratorButton key={g} generator={g} selected={g === selectedGenerator} />)}
    {/* <NavButton liClassNames={['pushRight']}>Preview</NavButton> */}
    <NavButton liClassNames={['pushRight']} buttonProps={{ onClick: saveConfig }}>Save</NavButton>
    {/* <NavButton>Upload</NavButton> */}
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

  function updateConfig(partialConfig: Partial<TableConfig>, newGenerator?: string) {
    const newConfig = { ...config, ...partialConfig };
    setConfig(newConfig);
    if (newGenerator) {
      navigate(`#${titleToSlug(newGenerator)}`);
    }
  }

  function updateEditPane(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newConfig = { ...config };
    newConfig.generators[generator] = event.target.value.split('\n');
    setConfig(newConfig);
    setEditPaneContent(event.target.value);
  }

  function updateTableItems(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newConfig = { ...config };
    newConfig.tables[selectedTable] = event.target.value.split('\n').filter(item => !!item.length);
    setConfig(newConfig);
    setTablePaneContent(event.target.value);
  }

  function addGenerator() {
    const newGenerator = "New Tab";
    const newGenerators = { ...config.generators, [newGenerator]: [] };
    updateConfig({ generators: newGenerators }, newGenerator);
  }

  function addTable() {
    const newTables = { ...config.tables, "new": [] };
    updateConfig({ tables: newTables });
    setSelectedTable("new");
  }

  function renameGenerator(event: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = event.target.value;
    const newGenerators = { ...config.generators, [newTitle]: config.generators[generator] };
    delete newGenerators[generator];
    updateConfig({ generators: newGenerators }, newTitle);
  }

  function renameTable(event: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = event.target.value;
    const newTables = { ...config.tables, [newTitle]: config.tables[selectedTable] };
    // maybe replace previous instances of it in generators here? weird edge case possibilities
    delete newTables[selectedTable];
    updateConfig({ tables: newTables });
    setSelectedTable(newTitle);
  }

  function deleteGenerator(event: React.MouseEvent<HTMLButtonElement>) {
    const newGenerators = { ...config.generators };
    delete newGenerators[generator];
    updateConfig({ generators: newGenerators }, Object.keys(config.generators)[0]);
  }

  function deleteTable(event: React.MouseEvent<HTMLButtonElement>) {
    const newTables = { ...config.tables };
    delete newTables[selectedTable];
    updateConfig({ tables: newTables });
    setSelectedTable(Object.keys(newTables)[0]);
  }

  function saveConfig() {
    const configBlob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json;charset=utf-8" });
    const filename = titleToSlug(config.title || 'generator-config');
    saveAs(configBlob, filename);
  }

  return <>
    <EditorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} saveConfig={saveConfig} />
    <div className="editorContent flexRow">
      <div className="flexRow editorMetadata">
        <input className="editorItem" placeholder='Config Title' value={config.title} onChange={(e) => updateConfig({ title: e.target.value })} />
        <input className="editorItem editorDescription" placeholder='Made by ... or intended for .... (optional)' value={config.description || ''} onChange={(e) => updateConfig({ description: e.target.value })} />
        <input className="editorItem" placeholder='https://my-cool-games.example.com (optional)' value={config.link || ''} onChange={(e) => updateConfig({ link: e.target.value })} />
      </div>
      <div className="editorGenerator">
        <div className="flexRow">
          <input className="editorItem" name="generatorName" value={generator} onChange={renameGenerator} />
          <button className="square" onClick={addGenerator}>+</button>
          {Object.keys(config.generators).length > 1 ? <button className="square" onClick={deleteGenerator}>x</button> : ''}
        </div>
        <textarea className="editorItem minTextareaHeight" onChange={updateEditPane} value={editPaneContent} />
        <div className="editorPreview">
          <Generator config={config} generator={generator} />
        </div>
      </div>
      <div className="editorTable">
        <div className="flexRow">
          <select className="editorItem editorTableSelect" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
            {Object.keys(config.tables).map(tableName => <option key={tableName}>{tableName}</option>)}
          </select>
          <button className="square" onClick={addTable}>+</button>
          {Object.keys(config.tables).length > 1 ? <button className="square" onClick={deleteTable}>x</button> : ''}
        </div>
        <div className="flexRow">
          <input className="editorItem" name="tableName" value={selectedTable} onChange={renameTable} />
        </div>
        <textarea className="editorItem minTextareaHeight" value={tablePaneContent} onChange={updateTableItems}></textarea>
      </div>
    </div>
  </>;
}


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

function EditorHeader({ generators, selectedGenerator }: {
  generators: string[],
  selectedGenerator: string
}) {
  const navigate = useNavigate();
  return <nav><ul className='navigation'>
    {generators.map((g) => <GeneratorButton key={g} generator={g} selected={g === selectedGenerator} />)}
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
    const newTables = {...config.tables, "new": []};
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
    const newTables = {...config.tables, [newTitle]: config.tables[selectedTable]};
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

  return <>
    <EditorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} />
    <div className="editorContent flexRow">
      <div className="editorGenerator">
        <div className="editorTitle flexRow">
          <input className="editorItem" name="generatorName" value={generator} onChange={renameGenerator} />
          <button className="square" onClick={addGenerator}>+</button>
          {Object.keys(config.generators).length > 1 ? <button className="square" onClick={deleteGenerator}>x</button> : ''}
        </div>
        <textarea className="editorItem" onChange={updateEditPane} value={editPaneContent} />
        <div className="editorPreview">
          <Generator config={config} generator={generator} />
        </div>
      </div>
      <div className="editorTable">
        <div className="tableTitle flexRow">
          <select className="editorItem editorTableSelect" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
            {Object.keys(config.tables).map(tableName => <option key={tableName}>{tableName}</option>)}
          </select>
          <button className="square" onClick={addTable}>+</button>
          {Object.keys(config.tables).length > 1 ? <button className="square" onClick={deleteTable}>x</button> : ''}
        </div>
        <div className="flexRow">
          <input className="editorItem" name="tableName" value={selectedTable} onChange={renameTable} />
        </div>
        <textarea className="editorItem" value={tablePaneContent} onChange={updateTableItems}></textarea>
      </div>
    </div>
  </>;
}


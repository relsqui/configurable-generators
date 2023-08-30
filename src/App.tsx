import React, { useEffect, useState } from 'react';
import './App.css';
import { Generator, GeneratorHeader } from './Generator';
import { TableConfig, ConfigDropZone } from './ConfigDropZone';

const defaultConfig: TableConfig = {
  schemaVersion: "0.1.0",
  title: "Configurable",
  generators: {},
  tables: {},
  isDefault: true
};

function CloseButton({ setConfig }: { setConfig: React.Dispatch<React.SetStateAction<TableConfig>> }) {
  return <button className="closeButton" onClick={() => setConfig(defaultConfig) }>X</button>
}

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [generator, setGenerator] = useState(Object.keys(config.generators)[0]);

  useEffect(() => {
    document.title = `${config.title} Generators`
  }, [config])

  function configLoadedCallback(config: TableConfig) {
    setConfig(config);
    setGenerator(Object.keys(config.generators)[0]);
  }

  return (
    <div className="App">
      {
        config.isDefault ?
          <ConfigDropZone configLoadedCallback={configLoadedCallback} /> :
          <>
            <header>
              <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} setGenerator={setGenerator} />
              <CloseButton setConfig={setConfig} />
            </header>
            <Generator generator={generator} config={config} />
          </>
      }
      <footer>
        <div className="configDescription">
          {config.description} {config.link ? <a href={config.link}>Link</a> : ''}
        </div>
        <div className="iconCredit">
          <a target="_blank" rel="noreferrer" href="https://icons8.com/icon/dBZiqj6QUc4V/die">Die</a> icon by <a target="_blank" rel="noreferrer" href="https://icons8.com">Icons8</a>
        </div>
      </footer>
    </div>
  );
}

export default App;

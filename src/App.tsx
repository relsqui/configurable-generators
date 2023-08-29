import React, { useEffect, useState } from 'react';
import './App.css';
import { Generator, GeneratorHeader } from './Generator';
import { TableConfig, ConfigDropZone } from './ConfigDropZone';

function App() {
  const defaultConfig: TableConfig = {
    schemaVersion: "0.1.0",
    title: "Configurable",
    description: "",
    generators: {},
    tables: {},
    isDefault: true
  };

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
            <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} setGenerator={setGenerator} />
            <Generator generator={generator} config={config} />
          </>
      }
      <footer>
        <div className="iconCredit">
          <a target="_blank" rel="noreferrer" href="https://icons8.com/icon/dBZiqj6QUc4V/die">Die</a> icon by <a target="_blank" rel="noreferrer" href="https://icons8.com">Icons8</a>
        </div>
        <div className="configDescription">
          {config.description} {config.link ? <a href={config.link}>Link</a> : ''}
        </div>
      </footer>
    </div>
  );
}

export default App;

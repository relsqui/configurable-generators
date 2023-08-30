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

function CloseButton({ closeButtonCallback }: { closeButtonCallback: () => void }) {
  return <button className="closeButton" onClick={closeButtonCallback}>X</button>
}

function GeneratorLayout({ config, generator, setGenerator, closeButtonCallback }: {
  config: TableConfig | null,
  generator: string,
  setGenerator: React.Dispatch<React.SetStateAction<string>>,
  closeButtonCallback: () => void
}) {
  return (
    config ?
      <>
        <header>
          <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} setGenerator={setGenerator} />
          <CloseButton closeButtonCallback={closeButtonCallback} />
        </header>
        <Generator generator={generator} config={config} />
      </>
      : <></>
  );
}

function App() {
  const [config, setConfig] = useState<TableConfig | null>(null);
  const [generator, setGenerator] = useState(Object.keys(config?.generators || { generators: [] })[0]);
  const configStorageLabel = 'generatorConfig';

  useEffect(() => {
    const storedConfig = localStorage.getItem(configStorageLabel);
    if (storedConfig) {
      const { config: savedConfig, generator: savedGenerator } = JSON.parse(storedConfig);
      if (savedConfig) {
        setConfig(savedConfig);
        setGenerator(savedGenerator || savedConfig.generators[0]);
        console.log(`restoring ${savedConfig.title} config`);
        return;
      }
    }
    setConfig(defaultConfig);
    console.log('setting default config');
  }, [])

  useEffect(() => {
    if (!config) return;
    document.title = `${config.title} Generators`;
    if (!config.isDefault) {
      // if we store the default config it'll overwrite a previously stored one on first load
      storeConfig(config, generator);
    }
  }, [config, generator])

  function storeConfig(config: TableConfig | null, generator: string) {
    localStorage.setItem(configStorageLabel, JSON.stringify({ config, generator }));
  }

  function configLoadedCallback(config: TableConfig) {
    setConfig(config);
    setGenerator(Object.keys(config.generators)[0]);
  }

  function closeButtonCallback() {
    setConfig(defaultConfig);
    storeConfig(null, '');
  }

  return (
    <div className="App">
      {
        config?.isDefault ?
          <ConfigDropZone configLoadedCallback={configLoadedCallback} /> :
          <GeneratorLayout config={config} generator={generator} setGenerator={setGenerator} closeButtonCallback={closeButtonCallback} />
      }
      <footer>
        {
          config ?
            <div className="configDescription">
              {config.description} {config.link ? <a href={config.link}>Link</a> : ''}
            </div>
            : <></>
        }
        <div className="iconCredit">
          <a target="_blank" rel="noreferrer" href="https://icons8.com/icon/dBZiqj6QUc4V/die">Die</a> icon by <a target="_blank" rel="noreferrer" href="https://icons8.com">Icons8</a>
        </div>
      </footer>
    </div>
  );
}

export default App;

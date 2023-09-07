import React, { useEffect, useState } from 'react';
import './App.css';
import { GeneratorLayout } from './Generator';
import { ConfigDropZone } from './ConfigDropZone';
import { TableConfig } from './tableConfig';

const defaultConfig: TableConfig = {
  schemaVersion: "0.1.0",
  title: "Select Configuration",
  description: "What is this?",
  link: "https://github.com/relsqui/configurable-generators",
  generators: {},
  tables: {},
  isDefault: true
};

function Footer({ description, link }: { description: string | undefined, link: string | undefined }) {
  return <footer>
    <div className="configDescription">
      {description} {link ? <a href={link}>Link</a> : ''}
    </div>
    <div className="iconCredit">
      Icons by <a target="_blank" rel="noreferrer" href="https://icons8.com">Icons8</a>
    </div>
  </footer>;
}

function App() {
  const configStorageLabel = 'generatorConfig';
  const { config: initialConfig, generator: initialGenerator } = storedConfigIfAvailable();
  const [config, setConfig] = useState(initialConfig);
  const [generator, setGenerator] = useState(initialGenerator);

  useEffect(() => {
    document.title = `${config.title} | Configurable Generators`;
    if (!config.isDefault) {
      localStorage.setItem(configStorageLabel, JSON.stringify({ config, generator }));
    }
  }, [config, generator]);

  function storedConfigIfAvailable() {
    const returnConfig = { config: defaultConfig, generator: '' };
    const storedConfig = localStorage.getItem(configStorageLabel);
    if (storedConfig) {
      const { config: savedConfig, generator: savedGenerator } = JSON.parse(storedConfig);
      if (savedConfig) {
        returnConfig.config = savedConfig;
        returnConfig.generator = savedGenerator || savedConfig.generators[0];
      }
    }
    return returnConfig;
  }

  function configLoadedCallback(config: TableConfig) {
    setConfig(config);
    setGenerator(Object.keys(config.generators)[0]);
  }

  function closeButtonCallback() {
    setConfig(defaultConfig);
    localStorage.removeItem(configStorageLabel);
  }

  return (
    <div className="App">
      {
        config.isDefault ?
          <ConfigDropZone configLoadedCallback={configLoadedCallback} /> :
          <GeneratorLayout config={config} generator={generator} setGenerator={setGenerator} closeButtonCallback={closeButtonCallback} />
      }
      <Footer description={config.description} link={config.link} />
    </div>
  );
}

export default App;

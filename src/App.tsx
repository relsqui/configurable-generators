import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { GeneratorLayout } from './Generator';
import { ConfigDropZone } from './ConfigDropZone';
import { TableConfig } from './tableConfig';
import { useHash } from './useHash';
import { titleToSlug, presetsBySlug } from './presets';

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
  const [config, setConfig] = useState(defaultConfig);
  const [generator, setGenerator] = useState('');
  const [hash, setHash] = useHash();

  const configLoadedCallback: (config: TableConfig) => void = useCallback((config: TableConfig) => {
    setConfig(config);
    setHash(titleToSlug(config.title));
    setGenerator(Object.keys(config.generators)[0]);
  }, [setHash]);

  useEffect(() => {
    // strip the # from the hash
    const slug = hash.slice(1);
    if (presetsBySlug[slug]) {
      configLoadedCallback(presetsBySlug[slug]);
    }
  }, [hash, configLoadedCallback ]);

  useEffect(() => {
    document.title = `${config.title} | Configurable Generators`;
    if (!config.isDefault) {
      localStorage.setItem(configStorageLabel, JSON.stringify({ config, generator }));
    }
  }, [config, generator]);

  function closeButtonCallback() {
    setConfig(defaultConfig);
    setHash('');
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
